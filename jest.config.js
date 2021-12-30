
module.exports = {
    testMatch: ['**/*.spec.[jt]s?(x)', '**/*.test.[jt]s?(x)'],
    moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "json"],
    testEnvironment: 'jsdom',
    modulePathIgnorePatterns: [
        '<rootDir>/node_modules'
    ],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        '^.+\\.(css|less)$': '<rootDir>/test/CSSStub.js'
    },
    // 정규식과 일치하는 파일의 변환 모듈을 지정합니다.
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    transform: {
        "^.+\\.js?$": "babel-jest",
    },
    
}