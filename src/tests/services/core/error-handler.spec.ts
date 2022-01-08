import { ErrorHandler } from "src/models/services/core/error-handler.service";

describe('ErrorHandler', () => {

    
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
                const result = ErrorHandler.hasParenthesisCountMismatch(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('hasBracketCountMismatch', () => {
        const inputs: { input: string, expectedResult: boolean }[] = [
            { input: ' a +b=c', expectedResult: false },
            { input: '1+sin[2]=3   ', expectedResult: false },
            { input: '( 1  +2)   =3  =ln[x*   4*csc[y] ]', expectedResult: false },
            { input: 'a+b^cos[x]<=c', expectedResult: false },
            { input: '-cot[x-b]^(c)*((e)/(f))', expectedResult: false },
            { input: ' a +tan[b=c', expectedResult: true },
            { input: '1+2]=3   ', expectedResult: true },
            { input: '1  +2]   =3  =(x*   4 )', expectedResult: true },
            { input: 'a+b^log[x<=c', expectedResult: true },
        ];

        inputs.forEach((test) => {
            it(`Should return ${test.expectedResult} for '${test.input}'`, () => {
                const result = ErrorHandler.hasBracketCountMismatch(test.input);
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
                const result = ErrorHandler.hasMisorderedClosingParenthesis(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('hasMisorderedClosingBrackets', () => {
        const inputs: { input: string, expectedResult: boolean }[] = [
            { input: '', expectedResult: false },
            { input: ' ', expectedResult: false },
            { input: 'a', expectedResult: false },
            { input: '(a)', expectedResult: false },
            { input: 'tan[a]+b', expectedResult: false },
            { input: 'tan[a+ ln[y]]+b', expectedResult: false },
            { input: 'sin[sin[sin[a]+b]]', expectedResult: false },
            { input: 'csc[csc[csc[csc[x]]]]', expectedResult: false },
            { input: '[[[[]]]]', expectedResult: false },
            { input: '[][][][]', expectedResult: false },
            { input: '1+tan[2]=-log[3, 5]   ', expectedResult: false },
            { input: '1+]2]=(3)   ', expectedResult: true },
            { input: ']tan[a]', expectedResult: true },
            { input: '][', expectedResult: true },
            { input: '[]]', expectedResult: true },
            { input: 'sec[sec[sec[a]+b+]]]', expectedResult: true },
            { input: '[][]]()()', expectedResult: true },
        ];

        inputs.forEach((test) => {
            it(`Should return ${test.expectedResult} for '${test.input}'`, () => {
                const result = ErrorHandler.hasMisorderedClosingBrackets(test.input);
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
                const result = ErrorHandler.hasEmptyParenthesis(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('hasEmptyBrackets', () => {
        const inputs: { input: string, expectedResult: boolean }[] = [
            { input: '', expectedResult: false },
            { input: ' ', expectedResult: false },
            { input: 'tan[a]+b', expectedResult: false },
            { input: 'sin[sin[sin[a]+b]]', expectedResult: false },
            { input: 'ln[ln[ln[ln[x]]]]', expectedResult: false },
            { input: '1+log[2]=-scs[(3)]   ', expectedResult: false },
            { input: '( 1  +2)   =3  =cot[x*   4 ]', expectedResult: false },
            { input: 'a+b^cos[(x)]<=c', expectedResult: false },
            { input: '[]', expectedResult: true },
            { input: '[   ]   ', expectedResult: true },
            { input: '[]+b', expectedResult: true },
            { input: '([[]+b])', expectedResult: true },
            { input: '[[[[]]]]', expectedResult: true },
            { input: '1+cos[2]=[]   ', expectedResult: true },
            { input: '( 1  +2)   =3  =[  ]*(x*   4 )', expectedResult: true },
            { input: 'a+b^log[]<=c', expectedResult: true },
        ];

        inputs.forEach((test) => {
            it(`Should return ${test.expectedResult} for '${test.input}'`, () => {
                const result = ErrorHandler.hasEmptyBrackets(test.input);
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
            { input: 'x^*', expectedResult: '^*' },
            { input: 'x^/b', expectedResult: '^/' },
            { input: 'x^/', expectedResult: '^/' },
        ];

        inputs.forEach((test) => {
            it(`Should return ${test.expectedResult} for '${test.input}'`, () => {
                const result = ErrorHandler.tooManyOperators(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('hasMisplacedOperators', () => {
        const inputs: { input: string, expectedResult: string | null }[] = [
            { input: 'a+b=c-d', expectedResult: null },
            { input: '()', expectedResult: null },
            { input: '[]', expectedResult: null },
            { input: '(a)', expectedResult: null },
            { input: '(-a)', expectedResult: null },
            { input: '(+a)', expectedResult: null },
            { input: 'cos[+a]', expectedResult: null },
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
            { input: '(a+b^-cos[/x])', expectedResult: '[/' },
            { input: '(-a+b^-cos[*x])', expectedResult: '[*' },
            { input: '(-a+b^-tan[*(x)])', expectedResult: '[*' },
            { input: '*)', expectedResult: '*)' },
            { input: '^)', expectedResult: '^)' },
            { input: '(a*)', expectedResult: '*)' },
            { input: 'tan[(a*)]', expectedResult: '*)' },
            { input: 'sin[a*]', expectedResult: '*]' },
            { input: '(a/)', expectedResult: '/)' },
            { input: '(a^)', expectedResult: '^)' },
            { input: '(a-)', expectedResult: '-)' },
            { input: '(a+)', expectedResult: '+)' },
            { input: '(a+b^-(x/))', expectedResult: '/)' },
            { input: '(-a+b^-(x*)', expectedResult: '*)' },
            { input: '(-a+b^-((x)*)', expectedResult: '*)' },
            { input: '(a+b^-log[x/])', expectedResult: '/]' },
            { input: '(-a+b^-csc[x*])', expectedResult: '*]' },
            { input: '(-a+b^-sec[(x)*])', expectedResult: '*]' },
        ];

        inputs.forEach((test) => {
            it(`Should return ${test.expectedResult} for '${test.input}'`, () => {
                const result = ErrorHandler.hasMisplacedOperators(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('hasMissingFunctionName', () => {
        const inputs: { input: string, expectedResult: boolean }[] = [
            { input: '', expectedResult: false },
            { input: 'a + (b-c)', expectedResult: false },
            { input: 'tan[x]', expectedResult: false },
            { input: 'tan[tan[x]]', expectedResult: false },
            { input: 'ln[x + log[b-6, E]]', expectedResult: false },
            { input: 'a-tan[x]', expectedResult: false },
            { input: 'a+tan[tan[x]]', expectedResult: false },
            { input: '3-ln[x + log[b-6, E]]', expectedResult: false },
            { input: '[x]', expectedResult: true },
            { input: 'tan[[x]]', expectedResult: true },
            { input: 'tan[-[x]]', expectedResult: true },
            { input: '[x + log[b-6, E]]', expectedResult: true },
            { input: 'ln[x + [b-6, E]]', expectedResult: true },
            { input: 'a-[x]', expectedResult: true },
            { input: 'a+[tan[x]]', expectedResult: true },
            { input: '3-ln[x ^ [b-6, E]]', expectedResult: true },
        ];

        inputs.forEach((test) => {
            it(`Should return ${test.expectedResult} for '${test.input}'`, () => {
                const result = ErrorHandler.hasMissingFunctionName(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });
});