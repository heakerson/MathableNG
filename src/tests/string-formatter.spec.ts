import { StringFormatter } from "src/models/string-formatter.model";

describe('StringFormatter', () => {

    describe('parseTermStrings', () => {
        const inputs: { input: string, expectedResult: string[] }[] = [
            { input: 'a+b+c', expectedResult: ['a', '+b', '+c'] },
            { input: '-a+b+c', expectedResult: ['-a', '+b', '+c'] },
            { input: '1-2-3', expectedResult: ['1', '-2', '-3'] },
            { input: '(1+2)+3-x*4', expectedResult: ['(1+2)', '+3', '-x*4'] },
            { input: '-(1+2)+3-x*4', expectedResult: ['-(1+2)', '+3', '-x*4'] },
            { input: 'a+-b*x+c', expectedResult: ['a', '+-b*x', '+c'] },
            { input: 'a+ -b*x - -c', expectedResult: ['a', '+-b*x', '--c'] },
            { input: '+a+ -b*(x+ y*z*(b*(1+2))) - -c', expectedResult: ['+a', '+-b*(x+y*z*(b*(1+2)))', '--c'] },
            { input: 'x^a/b', expectedResult: ['x^a/b'] },
            { input: 'x^-a/b', expectedResult: ['x^-a/b'] },
            { input: 'x^a/b/c', expectedResult: ['x^a/b/c'] },
            { input: 'x^-a/b/c', expectedResult: ['x^-a/b/c'] },
            { input: 'x^-a/-b/c', expectedResult: ['x^-a/-b/c'] },
            { input: 'x*-a/b/c', expectedResult: ['x*-a/b/c'] },
            { input: 'x*-a/-b/c', expectedResult: ['x*-a/-b/c'] },
            { input: '-a^(b)', expectedResult: ['-a^(b)'] },
            { input: '-a^-(b)', expectedResult: ['-a^-(b)'] },
            { input: '-a^-(b)*x', expectedResult: ['-a^-(b)*x'] },
            { input: '-a^-(b)(x)', expectedResult: ['-a^-(b)(x)'] },
            { input: '-(b)-(x)', expectedResult: ['-(b)', '-(x)'] },
            { input: 'a^b*c', expectedResult: ['a^b*c'] },
            { input: '-a^b*c', expectedResult: ['-a^b*c'] },
            { input: 'a^-b*c', expectedResult: ['a^-b*c'] },
            { input: '((a)/(b))', expectedResult: ['((a)/(b))'] },
            { input: 'x*((a)/(b))', expectedResult: ['x*((a)/(b))'] },
            { input: 'x*-((a)/(b))', expectedResult: ['x*-((a)/(b))'] },
            { input: 'x^((a)/(b))', expectedResult: ['x^((a)/(b))'] },
            { input: 'x^-((a)/(b))', expectedResult: ['x^-((a)/(b))'] },
            { input: 'a/b', expectedResult: ['a/b'] },
            { input: 'a/b*x', expectedResult: ['a/b*x'] },
            { input: 'a/-b*x', expectedResult: ['a/-b*x'] },
            { input: '(a)/(b)', expectedResult: ['(a)/(b)'] },
            { input: 'x*(a)/(b)', expectedResult: ['x*(a)/(b)'] },
            { input: 'x-(a)/(b)', expectedResult: ['x', '-(a)/(b)'] },
            { input: 'x+(a)/(b)', expectedResult: ['x', '+(a)/(b)'] },
            { input: 'x-a/b', expectedResult: ['x', '-a/b'] },
            { input: 'x*-(a)/(b)', expectedResult: ['x*-(a)/(b)'] },
            { input: 'x*(a)/(b)/c', expectedResult: ['x*(a)/(b)/c'] },
            { input: 'x*-(a)/(b)/c', expectedResult: ['x*-(a)/(b)/c'] },
            { input: 'x^(a)/(b)', expectedResult: ['x^(a)/(b)'] },
            { input: 'x^-(a)/(b)', expectedResult: ['x^-(a)/(b)'] },
            { input: 'x*-(a)/(b)-a/(b)', expectedResult: ['x*-(a)/(b)', '-a/(b)'] },
            { input: 'x*(a)/(b)/c+a/b', expectedResult: ['x*(a)/(b)/c', '+a/b'] },
        ];

        inputs.forEach((test) => {
            it(`Should parse '${test.input}' as ${test.expectedResult}`, () => {
                const result = StringFormatter.parseTermStrings(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('parseExpressionStrings', () => {
        const inputs: { input: string, expectedResult: string[] }[] = [
            { input: 'a+b=c', expectedResult: ['a+b', 'c'] },
            { input: '1-2=3', expectedResult: ['1-2', '3'] },
            { input: '1+2=3=-x*4', expectedResult: ['1+2', '3', '-x*4'] },
            { input: ' a +b=c', expectedResult: ['a+b', 'c'] },
            { input: '1+2=- 3   ', expectedResult: ['1+2', '-3'] },
            { input: ' 1  +2   =3  =x*   4 ', expectedResult: ['1+2', '3', 'x*4'] },
            { input: 'a+b<=c', expectedResult: ['a+b', 'c'] },
            { input: '1+2<=3', expectedResult: ['1+2', '3'] },
            { input: '1+2< =3=x*-4', expectedResult: ['1+2', '3', 'x*-4'] },
            { input: ' a +b  <=c', expectedResult: ['a+b', 'c'] },
            { input: '1-2>=3   ', expectedResult: ['1-2', '3'] },
            { input: ' 1  +2   > = 3  =x*   4 ', expectedResult: ['1+2', '3', 'x*4'] },
            { input: 'a+b> =c', expectedResult: ['a+b', 'c'] },
            { input: '-1+2>3', expectedResult: ['-1+2', '3'] },
            { input: '1+2> =3=x*4', expectedResult: ['1+2', '3', 'x*4'] },
            { input: ' a +b  >c', expectedResult: ['a+b', 'c'] },
            { input: '1+2<3   ', expectedResult: ['1+2', '3'] },
            { input: ' 1  +2   < = 3  >=x*   4 ', expectedResult: ['1+2', '3', 'x*4'] },
            { input: '  a* b', expectedResult: ['a*b'] },
            { input: '  ', expectedResult: [''] },
        ];

        inputs.forEach((test) => {
            it(`Should parse '${test.input}' as ${test.expectedResult}`, () => {
                const result = StringFormatter.parseExpressionStrings(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('removeEmptySpace', () => {
        const inputs: { input: string, expectedResult: string }[] = [
            { input: ' a +b=c', expectedResult: 'a+b=c'},
            { input: '1+2=3   ', expectedResult: '1+2=3' },
            { input: ' 1  +2   =3  =x*   4 ', expectedResult: '1+2=3=x*4' },
            { input: 'a+b<=c', expectedResult: 'a+b<=c' }
        ];

        inputs.forEach((test) => {
            it(`Should return '${test.input}' as ${test.expectedResult}`, () => {
                const result = StringFormatter.removeEmptySpace(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('hasParenthesisCountMismatch', () => {
        const inputs: { input: string, expectedResult: boolean }[] = [
            { input: ' a +b=c', expectedResult: false },
            { input: '1+(2)=3   ', expectedResult: false },
            { input: '( 1  +2)   =3  =(x*   4 )', expectedResult: false },
            { input: 'a+b^(x)<=c', expectedResult: false },
            { input: ' a +(b=c', expectedResult: true },
            { input: '1+2)=3   ', expectedResult: true },
            { input: '1  +2)   =3  =(x*   4 )', expectedResult: true },
            { input: 'a+b^(x<=c', expectedResult: true },
        ];

        inputs.forEach((test) => {
            it(`Should return ${test.expectedResult} for '${test.input}'`, () => {
                const result = StringFormatter.hasParenthesisCountMismatch(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('tooManyOperators', () => {
        const inputs: { input: string, expectedResult: string | null }[] = [
            { input: ' a +-b=c--d', expectedResult: null },
            { input: '1+(2)=3   ', expectedResult: null },
            { input: 'x^-y', expectedResult: null },
            { input: '--x*-y', expectedResult: null },
            { input: 'x^-(y)', expectedResult: null },
            { input: 'a+b^(x)<=c/-d', expectedResult: null },
            { input: '1++2=3', expectedResult: '++' },
            { input: '1+-2=3++b', expectedResult: '++' },
            { input: '1+--2=3++b', expectedResult: '+--' },
            { input: '1+-2=3**b', expectedResult: '**' },
            { input: '1/-2=3//b', expectedResult: '//' },
            { input: 'x^*b', expectedResult: '^*' },
            { input: 'x^/b', expectedResult: '^/' },
        ];

        inputs.forEach((test) => {
            it(`Should return ${test.expectedResult} for '${test.input}'`, () => {
                const result = StringFormatter.tooManyOperators(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('hasEmptyParenthesis', () => {
        const inputs: { input: string, expectedResult: boolean }[] = [
            { input: '', expectedResult: false },
            { input: ' ', expectedResult: false },
            { input: '(a)+b', expectedResult: false },
            { input: '(((a)+b))', expectedResult: false },
            { input: '((((x))))', expectedResult: false },
            { input: '1+(2)=(3)   ', expectedResult: false },
            { input: '( 1  +2)   =3  =(x*   4 )', expectedResult: false },
            { input: 'a+b^(x)<=c', expectedResult: false },
            { input: '()', expectedResult: true },
            { input: '(   )   ', expectedResult: true },
            { input: '()+b', expectedResult: true },
            { input: '((()+b))', expectedResult: true },
            { input: '(((())))', expectedResult: true },
            { input: '1+(2)=()   ', expectedResult: true },
            { input: '( 1  +2)   =3  =( )*(x*   4 )', expectedResult: true },
            { input: 'a+b^()<=c', expectedResult: true },
        ];

        inputs.forEach((test) => {
            it(`Should return ${test.expectedResult} for '${test.input}'`, () => {
                const result = StringFormatter.hasEmptyParenthesis(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('hasMisplacedOperators', () => {
        const inputs: { input: string, expectedResult: string | null }[] = [
            { input: 'a+b=c-d', expectedResult: null },
            { input: '()', expectedResult: null },
            { input: '(a)', expectedResult: null },
            { input: '(-a)', expectedResult: null },
            { input: '(+a)', expectedResult: null },
            { input: '(a+b^-(x))', expectedResult: null },
            { input: '(-a+b^-(x))', expectedResult: null },
            { input: '(*', expectedResult: '(*' },
            { input: '(^', expectedResult: '(^' },
            { input: '(*a)', expectedResult: '(*' },
            { input: '(/a)', expectedResult: '(/' },
            { input: '(^a)', expectedResult: '(^' },
            { input: '(a+b^-(/x))', expectedResult: '(/' },
            { input: '(-a+b^-(*x)', expectedResult: '(*' },
            { input: '(-a+b^-(*(x))', expectedResult: '(*' },
            { input: '*)', expectedResult: '*)' },
            { input: '^)', expectedResult: '^)' },
            { input: '(a*)', expectedResult: '*)' },
            { input: '(a/)', expectedResult: '/)' },
            { input: '(a^)', expectedResult: '^)' },
            { input: '(a-)', expectedResult: '-)' },
            { input: '(a+)', expectedResult: '+)' },
            { input: '(a+b^-(x/))', expectedResult: '/)' },
            { input: '(-a+b^-(x*)', expectedResult: '*)' },
            { input: '(-a+b^-((x)*)', expectedResult: '*)' },
        ];

        inputs.forEach((test) => {
            it(`Should return ${test.expectedResult} for '${test.input}'`, () => {
                const result = StringFormatter.hasMisplacedOperators(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('hasMisorderedClosingParenthesis', () => {
        const inputs: { input: string, expectedResult: boolean }[] = [
            { input: '', expectedResult: false },
            { input: ' ', expectedResult: false },
            { input: '(a)+b', expectedResult: false },
            { input: '(((a)+b))', expectedResult: false },
            { input: '((((x))))', expectedResult: false },
            { input: '(((())))', expectedResult: false },
            { input: '()()()()', expectedResult: false },
            { input: '1+(2)=(3)   ', expectedResult: false },
            { input: '1+)2)=(3)   ', expectedResult: true },
            { input: ')(a)', expectedResult: true },
            { input: ')(', expectedResult: true },
            { input: '())', expectedResult: true },
            { input: '(((a)+b+)))', expectedResult: true },
            { input: '()())()()', expectedResult: true },
        ];

        inputs.forEach((test) => {
            it(`Should return ${test.expectedResult} for '${test.input}'`, () => {
                const result = StringFormatter.hasMisorderedClosingParenthesis(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('parseFactorStrings', () => {
        const inputs: { input: string, expectedResult: string[] }[] = [
            { input: 'a', expectedResult: ['a']},
            { input: '-a', expectedResult: ['-a']},
            { input: '(-a)', expectedResult: ['(-a)']},
            { input: 'a*b', expectedResult: ['a', 'b'] },
            { input: '-a*-b', expectedResult: ['-a', '-b'] },
            { input: '-bob*-fred', expectedResult: ['-bob', '-fred'] },
            { input: '-(x+y)*-a*-b', expectedResult: ['-(x+y)','-a', '-b'] },
            { input: '-(x+y)*-(r)*-a*-b', expectedResult: ['-(x+y)','-(r)','-a', '-b'] },
            { input: '(x+y)*-a*-b', expectedResult: ['(x+y)','-a', '-b'] },
            { input: 'a^(b)', expectedResult: ['a^(b)'] },
            { input: '-a^(b)', expectedResult: ['-a^(b)'] },
            { input: '-a^-(b)', expectedResult: ['-a^-(b)'] },
            { input: '-a^-(b)*x', expectedResult: ['-a^-(b)', 'x'] },
            { input: 'a^b*c', expectedResult: ['a^b', 'c'] },
            { input: '-a^b*c', expectedResult: ['-a^b', 'c'] },
            { input: 'a^-b*c', expectedResult: ['a^-b', 'c'] },
            { input: '((a)/(b))', expectedResult: ['((a)/(b))'] },
            { input: 'x*((a)/(b))', expectedResult: ['x','((a)/(b))'] },
            { input: 'x*-((a)/(b))', expectedResult: ['x','-((a)/(b))'] },
            { input: 'x^((a)/(b))', expectedResult: ['x^((a)/(b))'] },
            { input: 'x^-((a)/(b))', expectedResult: ['x^-((a)/(b))'] },
            { input: 'a/b', expectedResult: ['a/b'] },
            { input: 'a/b*x', expectedResult: ['a/b', 'x'] },
            { input: 'a/-b*x', expectedResult: ['a/-b', 'x'] },
            { input: '(a)/(b)', expectedResult: ['(a)/(b)'] },
            { input: 'x*(a)/(b)', expectedResult: ['x','(a)/(b)'] },
            { input: 'x*-(a)/(b)', expectedResult: ['x','-(a)/(b)'] },
            { input: 'x^(a)/(b)', expectedResult: ['x^(a)/(b)'] },
            { input: 'x^-(a)/(b)', expectedResult: ['x^-(a)/(b)'] },
            { input: 'x^(a)/(b)/c', expectedResult: ['x^(a)/(b)/c'] },
            { input: 'x^-(a)/(b)/c', expectedResult: ['x^-(a)/(b)/c'] },
            { input: 'x^a/b', expectedResult: ['x^a/b'] },
            { input: 'x^-a/b', expectedResult: ['x^-a/b'] },
            { input: 'x^a/b/c', expectedResult: ['x^a/b/c'] },
            { input: 'x^-a/b/c', expectedResult: ['x^-a/b/c'] },
            { input: 'x^-a/-b/c', expectedResult: ['x^-a/-b/c'] },
            { input: 'x*-a/b/c', expectedResult: ['x','-a/b/c'] },
            { input: 'x*-a/-b/c', expectedResult: ['x','-a/-b/c'] },
            { input: '(a)*b', expectedResult: ['(a)','b'] },
            { input: '(a)*(b)', expectedResult: ['(a)','(b)'] },
            { input: '-(a)*-(b)', expectedResult: ['-(a)','-(b)'] },
        ];

        inputs.forEach((test) => {
            it(`Should parse '${test.input}' as ${test.expectedResult}`, () => {
                const result = StringFormatter.parseFactorStrings(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('getMatchingParenthesisIndex', () => {
        const inputs: { input: string, start: number; expectedResult: number }[] = [
            { input: '(a)', start: 0, expectedResult: 2 },
            { input: '(a)', start: 2, expectedResult: 0 },
            { input: '(a)*3', start: 0, expectedResult: 2 },
            { input: '(a)*3', start: 2, expectedResult: 0 },
            { input: 'x*(a)', start: 2, expectedResult: 4 },
            { input: 'x*(a)', start: 4, expectedResult: 2 },
            { input: '(a )* 3', start: 0, expectedResult: 3 },
            { input: '(a )* 3', start: 3, expectedResult: 0 },
            { input: '(a)*3', start: 1, expectedResult: -1 },
            { input: '(a)*3', start: 3, expectedResult: -1 },
            { input: '(a)*3', start: 4, expectedResult: -1 },
            { input: 'x*(-a*((b)/(a)))*3', start: 7, expectedResult: 9 },
            { input: 'x*(-a*((b)/(a)))*3', start: 9, expectedResult: 7 },
            { input: 'x*(-a*((b)/(a)))*3', start: 2, expectedResult: 15 },
            { input: 'x*(-a*((b)/(a)))*3', start: 15, expectedResult: 2 },
            { input: '', start: 3, expectedResult: -1 },
            { input: '(a)*x^-(y+(r -q))', start: 7, expectedResult: 16 },
            { input: '(a)*x^-(y+(r -q))', start: 16, expectedResult: 7 },
            { input: 'sin(a)', start: 3, expectedResult: 5 },
            { input: 'sin(a)', start: 5, expectedResult: 3 },
        ];

        inputs.forEach((test) => {
            it(`Should return index ${test.expectedResult}, start: ${test.start} in '${test.input}'`, () => {
                const result = StringFormatter.getMatchingParenthesisIndex(test.input, test.start);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });
});