import { style } from 'app/styles';

describe('app/styles', () => {
  describe('when calling style()', () => {
    test("with 'altPanel', it should merged altPanel and panel styles", () => {
      const styleOut: any = style('altPanel');
      expect(styleOut.background).toBe('whitesmoke');
      expect(styleOut.padding).toBe('7px');
    });
    test("with ('altPanel', 'fill', {custom}), it should give precedence to last (custom)", () => {
      const styleOut: any = style('altPanel', 'page', {
        width: '90%',
      });
      expect(styleOut.width).toBe('90%');
    });
    test("with (['altPanel', 'fill', {custom}]) as array, should work the same as individual params", () => {
      const custom = { width: '80%' };
      const styleOutSeparate: any = style('altPanel', 'fill', custom);
      const styleOutArray: any = style(['altPanel', 'fill', custom]);

      expect(styleOutSeparate).toEqual(styleOutArray);
    });
  });
});
