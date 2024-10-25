module.exports = function override(config) {
    config.resolve.fallback = {
      fs: false, // fs 모듈을 제거하여 브라우저 환경에서 사용하지 않음
      path: false // path 모듈도 사용하지 않도록 설정
    };
    return config;
  };
  