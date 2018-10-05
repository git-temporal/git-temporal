import { style, replaceGlobalStyles } from 'app/styles';

replaceGlobalStyles({
  page: {
    margin: 20,
    backgroundColor: 'black',
  },
  panel: {
    backgroundColor: 'white',
    marginRight: 10,
    marginBottom: 10,
    padding: 100,
  },
  altPanel: {
    _extends: 'panel',
    backgroundColor: 'greyaf',
  },
  altPanelPage: {
    _extends: ['altPanel', 'page'],
  },
});

describe('app/styles', () => {
  describe('when calling style()', () => {
    test("with 'altPanel', it should merged altPanel and panel styles", () => {
      const styleOut: any = style('altPanel');
      expect(styleOut.backgroundColor).toBe('greyaf');
      expect(styleOut.padding).toBe(100);
    });
    describe("with ('altPanel', 'page') and ('altPanelPage')", () => {
      let styleOutFromSeparate: any;
      let styleOutFromSingle: any;
      beforeAll(() => {
        styleOutFromSeparate = style('altPanel', 'page');
        styleOutFromSingle = style('altPanelPage');
      });
      test('the two outputs should equal each other', () => {
        expect(styleOutFromSeparate).toEqual(styleOutFromSingle);
      });
      test("it should give precedence to the last style specified ('page')", () => {
        expect(styleOutFromSeparate.backgroundColor).toBe('black');
        expect(styleOutFromSingle.backgroundColor).toBe('black');
      });
    });
    test("with ('altPanel', 'page', {custom}), it should give precedence to last (custom)", () => {
      const styleOut: any = style('altPanel', 'page', {
        backgroundColor: 'chartreuse',
      });
      expect(styleOut.backgroundColor).toBe('chartreuse');
    });
    test("with (['altPanel', 'page', {custom}]) as array, should work the same as individual params", () => {
      const custom = { backgroundColor: 'chartreuse' };
      const styleOutSeparate: any = style('altPanel', 'page', custom);
      const styleOutArray: any = style(['altPanel', 'page', custom]);

      expect(styleOutSeparate.backgroundColor).toBe('chartreuse');
      expect(styleOutArray.backgroundColor).toBe('chartreuse');
      expect(styleOutSeparate).toEqual(styleOutArray);
    });
  });
});
