const validRequest = {
    name: "Employee 1",
    contact: "1234567890",
    personal_email: "test@test.com",
    email: "emp1@peaksoft.com",
    birthDate: "1995-03-31",
    address: "Radhe Society, BudhNagar, Mohali, Punjab",
    designation: "QA Engineer",
}

const invalidRequest = {
    name: 1244,
    contact: "123456",
    personal_email: "test",
    email: "emp1",
    birthDate: "31-03-1995",
    address: 12.3,
    designation: true,
}

export default {
    validRequest,
    invalidRequest
}