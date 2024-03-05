let LIBRARY_DATA=[];

const BTN_WRITE=document.querySelector("#btn-write");
const BTN_UPDATE=document.querySelector("#btn-update");
const BTN_CANCEL=document.querySelector("#btn-cancel");
const BTN_DELETE=document.querySelector("#btn-delete");
const BTN_SEARCH=document.querySelector("#btn-search");

const LIBRARY_LIST=document.querySelector("#library-list");
//1.웹브라우저 localStorage 에 등록된 데이터 불러오기
librayList();


//1.등록처리
BTN_WRITE.addEventListener("click",function(){
    const title=document.querySelector("#title");
    const author=document.querySelector("#author");
    const regDate=document.querySelector("#regDate");
    const content=document.querySelector("#content");


    if(!validationForm(title,author,regDate,content)){
        return;
    }

    const inputData={
        id:Number(new Date().getTime()),
        title:title.value,
        author:author.value,
        regDate:regDate.value,
        content:content.value
    }

    //LIBRARY_DATA.push(inputData);
    //배열 앞에 붙이기 
    LIBRARY_DATA.unshift(inputData);    

    localStorage.setItem("STORAGE_LIBRARY_LIST", JSON.stringify(LIBRARY_DATA));
    //console.log("LIBRARY_DATA ", LIBRARY_DATA);
    refresh();

    librayList();
});


//2.등록및 수정시 유효성 체크
function validationForm(title,author,regDate,content){
    if(title.value===""){
        alert("제목을 입력하세요.");
        title.focus();
        return false;
    }
    if(author.value===""){
        alert("저자를 입력하세요.");
        author.focus();
        return false;
    }
    if(regDate.value===""){
        alert("출간날짜를 입력하세요.");
        regDate.focus();
        return false;
    }
    if(content.value===""){
        alert("내용을 입력하세요.");
        content.focus();
        return false;
    }

    return true;
}

//3.등록폼 초기화
 function refresh(){
    document.querySelector("#title").value="";
    document.querySelector("#author").value="";
    document.querySelector("#regDate").value="";
    document.querySelector("#content").value="";
    document.querySelector("#library-id").value="";

    BTN_WRITE.style.display="block";
    BTN_UPDATE.style.display="none";
    BTN_CANCEL.style.display="none";
    BTN_DELETE.style.display="none";  
 }



//4.데이터 목록  불러오기
function librayList(){
    let html="";
    const  getData=localStorage.getItem("STORAGE_LIBRARY_LIST");
 
    if(getData){
        console.log("LIBRARY_DATA " , LIBRARY_DATA);
        //LIBRARY_DATA.reverse();
        LIBRARY_DATA=JSON.parse(getData);   
    
        html=htmlTemplate(LIBRARY_DATA, html);
    }else{
        html=`
            <tr>
                <td colspan="5" class="text-center" >등록된 데이터가 없습니다.</td>
            </tr>    
        `;
    }
    LIBRARY_LIST.innerHTML=html;
}

//html 파싱 함수
function htmlTemplate(LData, html){        
    html =LData.map((libary, index)=>{       
        return `        
             <tr   onClick="updateLibraryForm(this)"  id='${libary.id}' class='trList'
                    data-id="${libary.id}"
                    data-title="${libary.title}"
                    data-content="${libary.content}"
                    data-author="${libary.author}"
                    data-regDate="${libary.regDate}"
                >
                <td>${LData.length-index}</td>
                <td>${libary.title}</td>
                <td>${libary.content}</td>
                <td>${libary.author}</td>
                <td>${libary.regDate}</td>
            </tr>        
        `            
    }).join('');
   
    if(LData.length<5){
       for(let i=0;i<5-LData.length;i++){
            html +=`       
                       <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>        
            ` 
        }
    }
    return html;
}


//5.업데이트-데이터를 업데이트 폼에 이동처리
function updateLibraryForm(event){
    const data=event.dataset;
    document.querySelector("#library-id").value=data.id;
    document.querySelector("#title").value=data.title;
    document.querySelector("#author").value=data.author;
    document.querySelector("#regDate").value=data.regdate;
    document.querySelector("#content").value=data.content;

   // document.getElementsByClassName("trList").style.background="#eee";
    const trList=document.querySelectorAll(".trList");
    trList.forEach(function(tr){
        tr.style.background="white";
    });   
    document.getElementById(data.id).style.background="#b5e61d";

    BTN_WRITE.style.display="none";
    BTN_UPDATE.style.display="inline-block";
    BTN_CANCEL.style.display="inline-block";
    BTN_DELETE.style.display="inline-block";    
} 


//6.취소하기
BTN_CANCEL.addEventListener("click", function(event){
    //초기화
    refresh();
    BTN_WRITE.style.display="block";
    BTN_UPDATE.style.display="none";
    BTN_CANCEL.style.display="none";
    BTN_DELETE.style.display="none";  
});


//7.수정하기 처리
BTN_UPDATE.addEventListener("click", function(event){
    const f_id=document.querySelector("#library-id");
    const f_title=document.querySelector("#title");
    const f_author=document.querySelector("#author");
    const f_regDate=document.querySelector("#regDate");
    const f_content=document.querySelector("#content");

    if(!validationForm(f_title,f_author,f_regDate,f_content)){
        return;
    }

    const updateData=LIBRARY_DATA.map((libary, index)=>{   
        if(libary.id==f_id.value)    {
            libary.id=f_id.value;
            libary.title=f_title.value;
            libary.author=f_author.value;
            libary.regDate=f_regDate.value;
            libary.content=f_content.value;
            return libary;
        }else{
            return libary;
        }     
    });

    LIBRARY_DATA=updateData;    
    localStorage.setItem("STORAGE_LIBRARY_LIST", JSON.stringify(LIBRARY_DATA));
    refresh();
    librayList();
});

//8.삭제하기
BTN_DELETE.addEventListener("click", function(event){
    if(confirm("정말 삭제 하시겠습니까?")){
        const f_id=document.querySelector("#library-id");
        const deleteData=LIBRARY_DATA.filter((libary, index)=>{   
            if(libary.id!=f_id.value) return libary;
        });
    
        LIBRARY_DATA=deleteData;    
        localStorage.setItem("STORAGE_LIBRARY_LIST", JSON.stringify(LIBRARY_DATA));
        refresh();
        librayList();
    }
});


//9.전체 삭제하기
function delateAll(){
    if(confirm("전체 데이터를  삭제 하시겠습니까1?")){
        LIBRARY_DATA=[];
        localStorage.removeItem("STORAGE_LIBRARY_LIST");        
        refresh();
        librayList();
    }
}

BTN_SEARCH.addEventListener("click",function(){
    const keyword=document.querySelector("#keyword");
    const startDate=document.querySelector("#start-date");
    const endDate=document.querySelector("#end-date");
    
    console.log("검색 :" ,keyword.value , startDate.value , endDate.value);

    const searchData=LIBRARY_DATA.filter((libary, index)=>{   
        
        if(startDate.value !="" && endDate.value!=""){

            if(keyword.value){
                if( (libary.title.indexOf(keyword.value)!=-1 || libary.author.indexOf(keyword.value)!=-1 || libary.content.indexOf(keyword.value)!=-1   )
                        &&
                    (libary.regDate >= startDate.value && libary.regDate <= endDate.value )
                    )    {
                    return libary;
                }
            }else{
                if(libary.regDate >= startDate.value && libary.regDate <= endDate.value){
                    return libary;
                }
            }          

        }else{
            if(libary.title.indexOf(keyword.value)!=-1 || 
                libary.author.indexOf(keyword.value)!=-1   || 
                libary.content.indexOf(keyword.value)!=-1)    {
                return libary;
            }  
        }

    });


    let html="";

    if(searchData.length>0){        
        html=htmlTemplate(searchData, html);
    }else{
        html=`
        <tr>
            <td colspan="5" class="text-center" >찾는  데이터가 없습니다.</td>
        </tr>    
     `;
    }
   
    LIBRARY_LIST.innerHTML=html;
});









