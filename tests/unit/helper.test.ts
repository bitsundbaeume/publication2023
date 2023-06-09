import { test, expect, describe } from 'vitest'
import { extensionIs, replaceExtension } from '@lib/helper'

describe("extensionIs", () => {

  test("test_happy_path_filename_with_extension", () => {
    const filename = "example.txt";
    const expectedExtension = "txt";
    const result = extensionIs(filename);
    expect(result).toEqual(expectedExtension);
  });
})

describe("replaceExtension", () => {
  test("Replace filename", () => {
    const filename = "example.txt";
    const newExtension = ".pdf";
    const result = replaceExtension(filename, newExtension);
    expect(result).toBe("example.pdf");
  });
})
