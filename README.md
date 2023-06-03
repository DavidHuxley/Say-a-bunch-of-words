# Say a bunch of words
<br>
<p align="center"><img src="https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/14c8409b-4869-4dd5-b342-21ac6cd7f1b4" width="300px"></p>
<br>

* 엽서디자인의 게시물에 자신의 생각을 작성하고 타유저들과 의견을 나눌수있는 커뮤니티 'Say a bunch of words'를 개발하는 프로젝트
* 프로젝트의 모든 부분을 혼자서 개발하는 1인 웹개발 프로젝트
* 단순한 기능개발이 아닌 사용자 경험을 고려하여 프로젝트를 완성하는것을 목표로 개발
* Google Cloud Platform을 이용해서 실제 배포까지 진행 하는것을 목표로 개발 

## 📌 Usage
* 프로젝트가 배포되었고 추가설치는 필요 없으므로 아래의 링크를 통해 접속
* [Say a bunch of words](https://bit.ly/3o769j8)
  * [Guest access](https://simplecheck-nodejs-mongodb.du.r.appspot.com/main?guestLogin=xUYbL%MxrIaQA7zM)  해당 url로 접속하면 회원가입 과정을 생략하고 guest로 이용가능합니다

## 📌 Skills & DevEnv

<a><img src="https://img.shields.io/badge/html5-2a2b38?style=for-the-badge&logo=html5&logoColor=E34F26"/></a>
<a><img src="https://img.shields.io/badge/css3-2a2b38?style=for-the-badge&logo=css3&logoColor=1572B6"/></a>
<a><img src="https://img.shields.io/badge/javascript-2a2b38?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/></a>
<a><img src="https://img.shields.io/badge/jquery-2a2b38.svg?style=for-the-badge&logo=jquery&logoColor=0769AD"/></a>

<a><img src="https://img.shields.io/badge/node.js-2a2b38?style=for-the-badge&logo=nodedotjs&logoColor=339933"/></a>
<a><img src="https://img.shields.io/badge/Express-2a2b38?style=for-the-badge&logo=express&logoColor=000000"/></a>
<a><img src="https://img.shields.io/badge/axios-2a2b38?style=for-the-badge&logo=axios&logoColor=5A29E4"/></a>
<a><img src="https://img.shields.io/badge/passport-2a2b38?style=for-the-badge&logo=passport&logoColor=34E27A"/></a>
<a><img src="https://img.shields.io/badge/.env-2a2b38?style=for-the-badge&logo=dotenv&logoColor=ECD53F"/></a>

<a><img src="https://img.shields.io/badge/mongodb-2a2b38?style=for-the-badge&logo=mongodb&logoColor=47A248"/></a>
<a><img src="https://img.shields.io/badge/mongoose-2a2b38?style=for-the-badge&logo=mongodb&logoColor=880000"/></a>
<a><img src="https://img.shields.io/badge/Google cloud platform-2a2b38?style=for-the-badge&logo=googlecloud&logoColor=4285F4"/></a>

<a><img src="https://img.shields.io/badge/git-2a2b38?style=for-the-badge&logo=git&logoColor=F05032"/></a>
<a><img src="https://img.shields.io/badge/github-2a2b38?style=for-the-badge&logo=github&logoColor=181717"/></a>
<a><img src="https://img.shields.io/badge/visual studio code-2a2b38?style=for-the-badge&logo=visualstudiocode&logoColor=007ACC"/></a>
<a><img src="https://img.shields.io/badge/chatGPT-2a2b38?style=for-the-badge&logo=openai&logoColor=74aa9c"/></a>


## 📌 Project Architecture
![Architecture](https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/88b030b1-c332-4470-8401-6067eb0bdb63)

## 📌 Database

- 해당 프로젝트는 비동기I/O가 특징인 Node.js와의 효율을 위해 마찬가지로 비동기 처리와 JSON 형식을 가진 MongoDB를 선택
- Mongoose 모듈을 사용하여 스키마를 정의함으로써 보장되지 않는 데이터 무결성을 보완 및 쿼리간소화를 통해 개발 생산성을 높임

<details>
 <summary><strong>User</strong></summary>
 
![collection_User drawio](https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/48c34b5e-024d-4a6a-af55-c76c98ee6bf5)
</details>
<details>
 <summary><strong>Post</strong></summary>
 
![collection_Post drawio](https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/5fd7859b-38cd-40e3-a902-9514be385aa9)
</details>
<details>
 <summary><strong>Comment</strong></summary>
 
![collection_Comment drawio](https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/c723affe-5e04-4c9e-818f-2abe8f2096cf)
</details>
<details>
 <summary><strong>Count</strong></summary>
 
![collection_Count drawio](https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/0321b061-0d18-4d22-95e8-8fec2864227d)
</details>


## 📌 Features

<details>
  <summary><strong>가입 및 탈퇴 관련</strong></summary>
  
  * 회원가입시 중복검사 및 정규표현식을 이용한 유효성 검사 (클라이언트, 서버 이중 유효성 검사를 통해 데이터 무결성 보장 및 보안강화)
      
    <a><img src="https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/4daf135b-f13c-409d-be8b-e92091bfbe4f" width="400"></a>
    <a><img src="https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/1b24131b-83f8-4750-9128-26c8dcc0a4ff" width="400"></a>
  
  * bcrypt를 이용한 단방향 비밀번호 암호화 (Blowfish 1024회 해싱 + 해당 모듈 자체 salt추가)
  
   https://github.com/DavidHuxley/Say-a-bunch-of-words/blob/11b1450aef5a038bb16f63168f2bbf3b35c5b016/routes/signInUp.js#L78
    <a><img src="https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/2a51d916-873a-45d3-9bc7-30baf22dd2da"></a>
  
  * 회원탈퇴시 해당 회원 게시글 및 댓글 숨김처리 
    https://github.com/DavidHuxley/Say-a-bunch-of-words/blob/11b1450aef5a038bb16f63168f2bbf3b35c5b016/routes/personal.js#L101-L120

</details>
<details>
  <summary><strong>로그인 및 로그아웃 관련</strong></summary>
  
  * passport를 이용한 로그인 구현 (세션방식)
    https://github.com/DavidHuxley/Say-a-bunch-of-words/blob/11b1450aef5a038bb16f63168f2bbf3b35c5b016/server.js#L41-L88
  * bcrypt 모듈을 사용해 암호화 검증 
  * 로그아웃시 세션에 저장된 로그인정보 삭제 후 리다이렉팅
  
  </details>
<details>
  <summary><strong>게시글 관련</strong></summary>
  
  * 게시글 작성
    * 작성 가능 글자 수 알람 및 초과시 자동정리
    * 이미지 업로드 및 미리보기 (multer 모듈 활용)
      * https://github.com/DavidHuxley/Say-a-bunch-of-words/blob/11b1450aef5a038bb16f63168f2bbf3b35c5b016/routes/upload.js#L32-L61
  
  * 게시글 삭제시 해당 게시글 숨김처리
  * 더보기 기능을 통해서 웹페이지의 초기 로딩 속도를 빠르게 하고, 서버 자원을 효율적으로 사용
  * 게시글마다 점수를 부여해 상호작용이 많은 게시글이 더욱 눈에 띄도록 함
    ![image](https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/044c4994-355d-4c38-abb5-f3d7b59471b6)
  * 게시글 상세보기에서 댓글, 저장 등의 상호작용시 비동기 처리를 활용해 페이지 갱신없이 빠르게 api호출

</details>
<details>
 <summary><strong>검색(index) 관련</strong></summary>
 
 * MongoDB Atlas에서 제공하는 Search Index 기능을 사용함
 * MongoDB Atlas의 클라우드 인프라를 기반으로 구축되어 있어 뛰어난 확장성과 안정성을 가지고있음
 * Apache Lucene (lucene.korean 한글 형태소 분석기) 검색 라이브러리를 기반으로 구축되어 있어, 기존의 text Index보다 더 빠르고 정확한 검색 결과를 제공
 * ![image](https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/c058887b-1f69-4bba-9dc3-0564230cc229)
 * POST 컬렉션의 title, content, writer 필드에서만 조회하도록 지정
 * https://github.com/DavidHuxley/Say-a-bunch-of-words/blob/11b1450aef5a038bb16f63168f2bbf3b35c5b016/routes/search.js#L10-L24
</details>
<details>
  <summary><strong>개인페이지 관련</strong></summary>
  
  * 자신이 작성 및 저장한 글의 상호작용(삭제, 저장취소 등)을 비동기 처리하여 사용자 경험 향상
  * 자신의 개인페이지와 타유저의 개인페이지 UI의 차이
     ![Personal drawio](https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/d6b821b8-fd83-40a3-8c85-f28458e3d190)
     ![Other User's Viewed_Personal drawio](https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/8cee4410-6995-4aa7-86ab-a74df18556c0)

  * 회원정보 수정
    * 프로필 이미지 업로드 및 미리보기
    * 닉네임 변경시 금칙어 설정, 이메일 공개여부 설정 등 

</details>  
<br>
