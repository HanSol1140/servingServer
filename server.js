// server.js
const express = require('express');
const app = express();
app.use(express.json());
// const axios = require('axios');
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용




const PORT = process.env.PORT || 8000;

// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});

// 라우터
const routerhandler = require('./routerhandler');
app.use('/', routerhandler);

// 함수

const { getPose, move } = require('./func');
getPose();