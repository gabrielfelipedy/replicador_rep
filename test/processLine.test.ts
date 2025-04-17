// processLine.test.js (or .ts)
import { describe, it, expect, vi } from "vitest";
import { processLine } from "../src/utils/ProcessLine.js";

describe("processLine", () => {
  const validInput = "00000010232025-04-09T12:38:00-0300080627153291ASCD";
  const expectedOutput = "00000010232025-04-09T12:38:00-030080627153291 ASCD";

  // Test 1: Happy Path - Valid input with type '3'
  it("should correctly process a valid line with tipoRegistro 3", async () => {
    const result = await processLine(validInput);
    expect(result).toBe(expectedOutput);
  });

  // Test 2: Invalid tipoRegistro - Should return null
  it("should return null if tipoRegistro is not 3", async () => {
    // Change the 10th character (index 9) from '3' to '1'
    const invalidTypeInput =
      "00000010212025-04-09T12:38:00-0300I080627153291ASCD";
    const result = await processLine(invalidTypeInput);
    expect(result).toBeNull();
  });

  // Test 3: Handling CRLF line endings - Should trim and process correctly
  it("should handle CRLF line endings correctly", async () => {
    const inputWithCRLF = validInput + "\r\n";
    const result = await processLine(inputWithCRLF);
    expect(result).toBe(expectedOutput);
  });

  // Test 4: Handling LF line endings - Should trim and process correctly
  it("should handle LF line endings correctly", async () => {
    const inputWithLF = validInput + "\n";
    const result = await processLine(inputWithLF);
    expect(result).toBe(expectedOutput);
  });

  // Test 5: Handling leading/trailing whitespace - Should trim and process correctly
  it("should handle leading and trailing whitespace", async () => {
    const inputWithWhitespace = "  \t" + validInput + "   ";
    const result = await processLine(inputWithWhitespace);
    expect(result).toBe(expectedOutput);
  });

  // Test 6: Line too short (less than 10 chars) - Should return null (error caught)
  it("should return null for lines too short to determine tipoRegistro", async () => {
    const shortInput = "12345678";
    // Spy on console.error to check if it's called in case of error
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await processLine(shortInput);
    expect(result).toBeNull();
    // Optional: check if error was logged
    // expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  // Test 7: Line too short (less than 46 chars but >= 10) - Should return null (error likely caught)
  it("should return null for lines too short for full processing (less than 46 chars)", async () => {
    const shortInputValidType = "0000001023ABCDEFGHIJ"; // Length 20, type '3'
    // Spy on console.error
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await processLine(shortInputValidType);
    expect(result).toBeNull();

    errorSpy.mockRestore();
  });

  // Test 8: Empty string input - Should return null
  it("should return null for an empty string input", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await processLine("");
    expect(result).toBeNull();

    errorSpy.mockRestore();
  });

  // Test 9: Line exactly 46 chars long (no CRC part) - Should return error
  it("should handle lines that are exactly 46 characters long", async () => {
    const input46Chars = "00000010232025-04-09T12:38:00-0300080627153291";
    const expectedOutput46 = null; // Note the space at the end
    const result = await processLine(input46Chars);
    expect(result).toBe(expectedOutput46);
  });

  // Test 10: Line longer than expected - Should take first 46 and the rest
  it("should handle lines longer than needed, processing correctly", async () => {
    const longInput =
      "00000010232025-04-09T12:38:00-0300080627153291ASCD_EXTRADATA";
    const expectedLongOutput =
      "00000010232025-04-09T12:38:00-030080627153291 ASCD_EXTRADATA"; // Note the extra data appended after space
    const result = await processLine(longInput);
    expect(result).toBe(expectedLongOutput);
  });
});
