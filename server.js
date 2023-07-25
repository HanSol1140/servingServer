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
const { cancle, move, charge, checkBattery, getPose, test } = require('./func');
// cancle();
// move(2);
// charge(3);
// getPose('192.168.0.137:8001');
// getPose('192.168.0.137:8002');
// getPose('192.168.0.137:8003');
// getPose('192.168.0.137:8004');
// getPose('192.168.0.137:8005');
getPose('192.168.0.13');
// test();


//
// getcurrentspeed 사용 불가 - 설정 속도가아닌 (이동중상태일때만 api가 작동함, 설정 주행속도 확인불가)