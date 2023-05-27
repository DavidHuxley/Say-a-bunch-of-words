# Say a bunch of words
<br>
<p align="center"><img src="https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/14c8409b-4869-4dd5-b342-21ac6cd7f1b4" width="300px"></p>
<br>

* **엽서디자인의 게시물에 자신의 생각을 작성하고 타유저들과 의견을 나눌수있는 커뮤니티 'Say a bunch of words'를 개발하는 프로젝트**
* **프로젝트의 모든 부분을 혼자서 개발하는 1인 웹개발 프로젝트**
* **단순한 기능개발이 아닌 사용자 경험을 고려하여 프로젝트를 완성하는것을 목표로 개발**
* **Google Cloud Platform을 이용해서 배포까지 하는것을 목표로 개발** 

## 📌 Usage
* **프로젝트가 배포되었고 추가설치는 필요 없으므로 아래의 링크를 통해 접속**
* **[Say a bunch of words](https://bit.ly/3o769j8)**
  * **[Guest access](https://simplecheck-nodejs-mongodb.du.r.appspot.com/main?guestLogin=xUYbL%MxrIaQA7zM)**  해당 url로 접속하면 회원가입 과정을 생략하고 guest로 이용가능합니다

## 📌 사용 기술 및 개발 환경

<a><img src="https://img.shields.io/badge/html5-2a2b38?style=for-the-badge&logo=html5&logoColor=E34F26"/></a>
<a><img src="https://img.shields.io/badge/css3-2a2b38?style=for-the-badge&logo=css3&logoColor=1572B6"/></a>
<a><img src="https://img.shields.io/badge/javascript-2a2b38?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/></a>

<a><img src="https://img.shields.io/badge/node.js-2a2b38?style=for-the-badge&logo=nodedotjs&logoColor=339933"/></a>
<a><img src="https://img.shields.io/badge/Express-2a2b38?style=for-the-badge&logo=express&logoColor=000000"/></a>
<a><img src="https://img.shields.io/badge/axios-2a2b38?style=for-the-badge&logo=axios&logoColor=5A29E4"/></a>
<a><img src="https://img.shields.io/badge/passport-2a2b38?style=for-the-badge&logo=passport&logoColor=34E27A"/></a>
<a><img src="https://img.shields.io/badge/.env-2a2b38?style=for-the-badge&logo=dotenv&logoColor=ECD53F"/></a>

<a><img src="https://img.shields.io/badge/mongodb-2a2b38?style=for-the-badge&logo=mongodb&logoColor=47A248"/></a>
<a><img src="https://img.shields.io/badge/Google cloud platform-2a2b38?style=for-the-badge&logo=googlecloud&logoColor=4285F4"/></a>

<a><img src="https://img.shields.io/badge/git-2a2b38?style=for-the-badge&logo=git&logoColor=F05032"/></a>
<a><img src="https://img.shields.io/badge/github-2a2b38?style=for-the-badge&logo=github&logoColor=181717"/></a>
<a><img src="https://img.shields.io/badge/visual studio code-2a2b38?style=for-the-badge&logo=visualstudiocode&logoColor=007ACC"/></a>
<a><img src="https://img.shields.io/badge/chatGPT-2a2b38?style=for-the-badge&logo=openai&logoColor=74aa9c"/></a>


## 📌 Project Architecture
![Architecture](https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/88b030b1-c332-4470-8401-6067eb0bdb63)



## 📌 Features

<details>
  <summary><strong>가입 및 탈퇴 관련</strong></summary>
  
  * 회원가입시 중복검사 및 정규표현식을 이용한 유효성 검사
      
    <a><img src="https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/4daf135b-f13c-409d-be8b-e92091bfbe4f" width="400"></a>
    <a><img src="https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/1b24131b-83f8-4750-9128-26c8dcc0a4ff" width="400"></a>
  
  * bcrypt를 이용한 단방향 비밀번호 암호화
  
  https://github.com/DavidHuxley/Say-a-bunch-of-words/blob/7913ddd5d25a6ae0cb622874301eddb2019c8866/routes/signInUp.js#L49
    <a><img src="https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/2a51d916-873a-45d3-9bc7-30baf22dd2da"></a>
  
  * 회원탈퇴시 해당 회원 게시글 및 댓글 숨김처리 
    https://github.com/DavidHuxley/Say-a-bunch-of-words/blob/7913ddd5d25a6ae0cb622874301eddb2019c8866/routes/personal.js#L77-L101

</details>
<details>
  <summary><strong>로그인 및 로그아웃 관련</strong></summary>
  
  * passport를 이용한 로그인 구현 (세션방식)
    https://github.com/DavidHuxley/Say-a-bunch-of-words/blob/7913ddd5d25a6ae0cb622874301eddb2019c8866/server.js#L37-L81
  * bcrypt 사용으로 암호화 검증 
  * 로그아웃시 세션에 저장된 로그인정보 삭제 후 리다이렉팅
  
  </details>
<details>
  <summary><strong>게시글 관련</strong></summary>
  
  * 게시글 작성
    * 작성 가능 글자 수 알람 및 초과시 자동정리
    * 이미지 업로드 및 미리보기 (multer 모듈 활용)
      * https://github.com/DavidHuxley/Say-a-bunch-of-words/blob/34d432bace869c3f68508fa991171d239798e93a/routes/upload.js#L18-L45
  
  * 게시글 삭제시 해당 게시글 숨김처리
  * 게시글 검색 (mongoDB Atlas Search Indexes 기능사용)
    * https://github.com/DavidHuxley/Say-a-bunch-of-words/blob/34d432bace869c3f68508fa991171d239798e93a/routes/search.js#L5-L36
  * 더보기 기능을 통해서 웹페이지의 초기 로딩 속도를 빠르게 하고, 서버 자원을 효율적으로 사용
  * 게시글마다 점수를 부여해 상호작용이 많은 게시글이 더욱 눈에 띄도록 함
    ![image](https://github.com/DavidHuxley/Say-a-bunch-of-words/assets/127188578/044c4994-355d-4c38-abb5-f3d7b59471b6)
  * 게시글 상세보기에서 댓글, 저장 등의 상호작용시 비동기 처리를 활용해 페이지 갱신없이 빠르게 api호출

</details>
<details>
  <summary><strong>개인페이지 관련</strong></summary>
  
  * 자신이 작성 및 저장한 글의 상호작용(삭제, 저장취소 등)을 비동기 처리하여 사용자 경험 향상
  * 회원정보 수정
    * 프로필 이미지 업로드 및 미리보기
    * 닉네임 변경시 금칙어 설정, 이메일 공개여부 설정 등

</details>  

### 📌 Self-Feedback
* CI/CD를 따로 공부하지 못해 프로젝트에 적용시키지 못한 부분
* 1인 개발이였어도 백엔드 개발자를 지향하는 만큼 클라이언트에서 힘을 빼고 서버쪽에 좀 더 리소스를 썼어야 했음
* 마찬가지로 1인 개발이라는 마인드 때문에 gif-flow 전략을 전혀 사용하지 않고 단일 branch로 버전관리 한것

