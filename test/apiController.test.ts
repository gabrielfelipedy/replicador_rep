import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { Clock } from "../src/models/Clock.js";
import { login } from "../src/controllers/ApiController.js";

vi.mock("axios");
const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
};

const validClock: Clock = {
  id: 1,
  ip: "192.168.0.10",
  descricao: "Main Entrance",
  user: "admin",
  password: "admin",
};

const invalidClock: Clock = {
  ...validClock,
  user: "",
  password: "",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("login function", () => {
  it("should return session data for valid credentials", async () => {
    mockedAxios.post = vi
      .fn()
      .mockResolvedValue({ data: { session: "abcd1234" } });

    const result = await login(validClock);
    expect(result).toEqual("abcd1234");
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `https://${validClock.ip}/login.fcgi`,
      { login: validClock.user, password: validClock.password }
    );
  });

  it("should return error for invalid password", async () => {
    //const clock = { ...validClock, password: "wrongpass" };
    mockedAxios.post = vi
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    const result = await login(invalidClock);
    expect(result).toBeUndefined(); // because the function only logs error
  });

  it("should return error for invalid username", async () => {
    const clock = { ...validClock, user: "wronguser" };
    mockedAxios.post = vi
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    const result = await login(clock);
    expect(result).toBeUndefined();
  });

  it("should return error for both user and password invalid", async () => {
    const clock = { ...validClock, user: "x", password: "y" };
    mockedAxios.post = vi
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    const result = await login(clock);
    expect(result).toBeUndefined();
  });

  it("should return error when user is empty", async () => {
    const clock = { ...invalidClock, password: "admin" };
    mockedAxios.post = vi
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    const result = await login(clock);
    expect(result).toBeUndefined();
  });

  it("should return error when password is empty", async () => {
    const clock = { ...invalidClock, user: "admin" };
    mockedAxios.post = vi
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    const result = await login(clock);
    expect(result).toBeUndefined();
  });

  it("should return error when both user and password are empty", async () => {
    mockedAxios.post = vi
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    const result = await login(invalidClock);
    expect(result).toBeUndefined();
  });

  it("should handle network errors gracefully", async () => {
    mockedAxios.post = vi.fn().mockRejectedValue(new Error("Network Error"));

    const result = await login(validClock);
    expect(result).toBeUndefined();
  });

  it("should handle timeclock not found (404)", async () => {
    mockedAxios.post = vi.fn().mockRejectedValue({ response: { status: 404 } });

    const result = await login(validClock);
    expect(result).toBeUndefined();
  });

  it("should handle unexpected response structure", async () => {
    mockedAxios.post = vi.fn().mockResolvedValue({ data: null });

    const result = await login(validClock);
    expect(result).toBeNull();
  });
});