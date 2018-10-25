modeule.exports = {

    // 클라이언트로부터 받은 값이 Null인지 체크
    checkNull: (value) => {
        for (let v of value) {
            if (v === "" || v === null || v === undefined) {
                return 1;
            }
        }
        return 0;
    }
}