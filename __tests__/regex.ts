import {deviceNameRegex} from "../utils/regex.ts";
describe('Regex Test for Oplus pattern', () => {

    test('Valid values should match the pattern', () => {
        expect(deviceNameRegex.test('Oplus-1234')).toBe(true);
        expect(deviceNameRegex.test('Oplus-5678')).toBe(true);
    });

    test('Invalid values should not match the pattern', () => {
        expect(deviceNameRegex.test('Oplus-ABCD')).toBe(false); // Shouldn't match letters
        expect(deviceNameRegex.test('Oplus-12345')).toBe(false); // Shouldn't match more than 4 digits
        expect(deviceNameRegex.test('Some other text Oplus-5678 here')).toBe(false); // Shouldn't match if there's other text
        expect(deviceNameRegex.test('1234-Oplus-5678')).toBe(false); // Shouldn't match if "Oplus-" is not at the beginning
    });
});