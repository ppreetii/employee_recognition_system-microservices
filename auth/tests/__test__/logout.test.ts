import request from "supertest";

import { app } from "../../src/app";
import { API } from "../../src/constants/api";
import data from "../data/auth";
import { createAccount } from "../utils/auth";

const url = `${API.BASE_URL}${API.AUTH}${API.LOGOUT}`;

describe(`Logout : POST ${url}`, () => {
  it("Clears cookie upon Logout", async () => {
    //Login
    await createAccount(data.request.email,data.request.password, data.request.role);

    const loginresponse = await request(app)
      .post(`${API.BASE_URL}${API.AUTH}${API.LOGIN}`)
      .send({
        email: data.request.email,
        password: data.request.password,
      })
      .expect(200);

    expect(loginresponse.get("Set-Cookie")).toBeDefined();

    //Logout
    const response = await request(app)
      .post(url)
      .send({})
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
    expect(response.get("Set-Cookie")[0]).toEqual(
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});
