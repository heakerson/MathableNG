import { StringFormatter } from "src/models/services/core/string-formatter.service";

describe('StringFormatter', () => {

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
            { input: '(1+2)<3   ', expectedResult: ['(1+2)', '3'] },
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

    describe('parseTermStrings', () => {
        const inputs: { input: string, expectedResult: string[] }[] = [
            { input: 'a+b+c', expectedResult: ['a', '+b', '+c'] },
            { input: '-a+b+c', expectedResult: ['-a', '+b', '+c'] },
            { input: '1-2-3', expectedResult: ['1', '-2', '-3'] },
            { input: '(1+2)+3-x*4', expectedResult: ['(1+2)', '+3', '-x*4'] },
            { input: '-(1+2)+3-x*4', expectedResult: ['-(1+2)', '+3', '-x*4'] },
            { input: '-(1+2+sin[x])+3-x*4', expectedResult: ['-(1+2+sin[x])', '+3', '-x*4'] },
            { input: '-(1+2)+3-x*4*sin[x]', expectedResult: ['-(1+2)', '+3', '-x*4*sin[x]'] },
            { input: 'a+-b*x+c', expectedResult: ['a', '+-b*x', '+c'] },
            { input: 'a+ -b*x - -c', expectedResult: ['a', '+-b*x', '--c'] },
            { input: '+a+ -b*(x+ y*z*(b*(1+2))) - -c', expectedResult: ['+a', '+-b*(x+y*z*(b*(1+2)))', '--c'] },
            { input: '+a+ -b*(tan[x]+ y*z*(b*(1+2))) - -c', expectedResult: ['+a', '+-b*(tan[x]+y*z*(b*(1+2)))', '--c'] },
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
            { input: 'x*(a)/(b)/csc[c]', expectedResult: ['x*(a)/(b)/csc[c]'] },
            { input: 'x*-(a)/(b)/c', expectedResult: ['x*-(a)/(b)/c'] },
            { input: 'x^(a)/(b)', expectedResult: ['x^(a)/(b)'] },
            { input: 'x^-(a)/(b)', expectedResult: ['x^-(a)/(b)'] },
            { input: 'x*-(a)/(b)-a/(b)', expectedResult: ['x*-(a)/(b)', '-a/(b)'] },
            { input: 'x*(a)/(b)/c+a/b', expectedResult: ['x*(a)/(b)/c', '+a/b'] },
            { input: '-cot[x-b]^(c)', expectedResult: ['-cot[x-b]^(c)']},
            { input: '-cot[x-b]^(c)-log[a-b, -x]', expectedResult: ['-cot[x-b]^(c)', '-log[a-b,-x]']}
        ];

        inputs.forEach((test) => {
            it(`Should parse '${test.input}' as ${test.expectedResult}`, () => {
                const result = StringFormatter.parseTermStrings(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('parseRationalExpressions', () => {
        const inputs: { input: string, expectedNum: string, expectedDenom: string }[] = [
            { input: '((a)/(b))', expectedNum: '(a)', expectedDenom: '(b)'},
            { input: '((a)/(sin[b/c]))', expectedNum: '(a)', expectedDenom: '(sin[b/c])'},
            { input: '((-a)/(b))', expectedNum: '(-a)', expectedDenom: '(b)'},
            { input: '((a)/(-b))', expectedNum: '(a)', expectedDenom: '(-b)'},
            { input: '(-(a)/(b))', expectedNum: '-(a)', expectedDenom: '(b)'},
            { input: '((a)/-(b))', expectedNum: '(a)', expectedDenom: '-(b)'},
            { input: '-((a)/(b))', expectedNum: '(a)', expectedDenom: '(b)'},
            { input: '-((-a)/(b))', expectedNum: '(-a)', expectedDenom: '(b)'},
            { input: '-((a)/(-b))', expectedNum: '(a)', expectedDenom: '(-b)'},
            { input: '-(-(a)/(b))', expectedNum: '-(a)', expectedDenom: '(b)'},
            { input: '-((a)/-(b))', expectedNum: '(a)', expectedDenom: '-(b)'},
            { input: '(a)/(b)', expectedNum: '(a)', expectedDenom: '(b)'},
            { input: '(-a)/(b)', expectedNum: '(-a)', expectedDenom: '(b)'},
            { input: '(a)/(-b)', expectedNum: '(a)', expectedDenom: '(-b)'},
            { input: '-(a)/(b)', expectedNum: '-(a)', expectedDenom: '(b)'},
            { input: '-(a)/tan[b]', expectedNum: '-(a)', expectedDenom: 'tan[b]'},
            { input: '-(a)/-tan[b/c]', expectedNum: '-(a)', expectedDenom: '-tan[b/c]'},
            { input: '-tan[b/c]/-(a)', expectedNum: '-tan[b/c]', expectedDenom: '-(a)'},
            { input: '-tan[(b/c)]/-(a)', expectedNum: '-tan[(b/c)]', expectedDenom: '-(a)'},
            { input: '-tan[(b/c)]/-(a)/d', expectedNum: '-tan[(b/c)]', expectedDenom: '-(a)/d'},
            { input: '(a)/-(b)', expectedNum: '(a)', expectedDenom: '-(b)'},
            { input: 'a/(b)', expectedNum: 'a', expectedDenom: '(b)'},
            { input: '-a/(b)', expectedNum: '-a', expectedDenom: '(b)'},
            { input: '(a)/-b', expectedNum: '(a)', expectedDenom: '-b'},
            { input: 'a/b', expectedNum: 'a', expectedDenom: 'b'},
            { input: '-a/b', expectedNum: '-a', expectedDenom: 'b'},
            { input: 'a/b/c', expectedNum: 'a', expectedDenom: 'b/c'},
            { input: 'a/-b/c', expectedNum: 'a', expectedDenom: '-b/c'},
            { input: '-a/b/(c)', expectedNum: '-a', expectedDenom: 'b/(c)'},
            { input: 'a/(b/c)', expectedNum: 'a', expectedDenom: '(b/c)'},
            { input: 'a/-(b/c)', expectedNum: 'a', expectedDenom: '-(b/c)'},
            { input: '-a/b/(c)', expectedNum: '-a', expectedDenom: 'b/(c)'},
            { input: 'a/(b/c)', expectedNum: 'a', expectedDenom: '(b/c)'},
            { input: 'a/-(b/c)', expectedNum: 'a', expectedDenom: '-(b/c)'},
            { input: '-(a/b)/c', expectedNum: '-(a/b)', expectedDenom: 'c'},
            { input: '(a/b)/c', expectedNum: '(a/b)', expectedDenom: 'c'},
            { input: '(a/-b)/(c)', expectedNum: '(a/-b)', expectedDenom: '(c)'},
            { input: 'a/-(b/d)/c', expectedNum: 'a', expectedDenom: '-(b/d)/c'},
            { input: 'a', expectedNum: '', expectedDenom: ''},
            { input: '(a+b/c)', expectedNum: '', expectedDenom: ''},
            { input: 'a+b/c', expectedNum: '', expectedDenom: ''},
            { input: '(a/b+c)', expectedNum: '', expectedDenom: ''},
            { input: 'a^(b/c)', expectedNum: '', expectedDenom: ''},
            { input: 'sin[a/b]', expectedNum: '', expectedDenom: ''},
            { input: 'cot[a/b/c]', expectedNum: '', expectedDenom: ''},
            { input: 'a*cot[a/b/c]', expectedNum: '', expectedDenom: ''},
            { input: 'a/cot[a/b/c]', expectedNum: 'a', expectedDenom: 'cot[a/b/c]'},
            { input: 'a-cot[a/b/c]', expectedNum: '', expectedDenom: ''},
            { input: '(a*b/c)', expectedNum: '', expectedDenom: ''},
            { input: 'a/b*x/c', expectedNum: '', expectedDenom: ''},
        ];

        inputs.forEach((test) => {
            it(`Should parse ${test.input} in to '${test.expectedNum}' and '${test.expectedDenom}'`, () => {
                const result = StringFormatter.parseRationalExpressions(test.input);
                expect(result.numerator).toEqual(test.expectedNum);
                expect(result.denominator).toEqual(test.expectedDenom);
            });
        });
    });

    describe('parsePowerFactor', () => {
        const inputs: { input: string, expectedBase: string, expectedExponent: string }[] = [
            { input: 'a^b', expectedBase: 'a', expectedExponent: 'b' },
            { input: '-a^b', expectedBase: '-a', expectedExponent: 'b' },
            { input: 'a^-b', expectedBase: 'a', expectedExponent: '-b' },
            { input: 'a^(-b)', expectedBase: 'a', expectedExponent: '(-b)' },
            { input: 'a^-(-b)', expectedBase: 'a', expectedExponent: '-(-b)' },
            { input: '-(a+b)^(b/c)', expectedBase: '-(a+b)', expectedExponent: '(b/c)' },
            { input: '-(a+b)^b/c', expectedBase: '-(a+b)', expectedExponent: 'b/c' },
            { input: '-(a+b)^b/sin[x^y]', expectedBase: '-(a+b)', expectedExponent: 'b/sin[x^y]' },
            { input: '-(a+b)^(b/sin[x^y])', expectedBase: '-(a+b)', expectedExponent: '(b/sin[x^y])' },
            { input: '-(a+b)^b/c*x', expectedBase: '-(a+b)', expectedExponent: 'b/c*x' },
            { input: '-a^b^-c', expectedBase: '-a', expectedExponent: 'b^-c' },
            { input: '-(a^b)^-c', expectedBase: '-(a^b)', expectedExponent: '-c' },
            { input: 'cos[a^b]', expectedBase: '', expectedExponent: '' },
            { input: 'cos[a^b]^c', expectedBase: 'cos[a^b]', expectedExponent: 'c' },
            { input: 'a', expectedBase: '', expectedExponent: '' },
            { input: 'a/b^x', expectedBase: 'a/b', expectedExponent: 'x' },
            { input: 'x^b/c', expectedBase: 'x', expectedExponent: 'b/c' },
            { input: 'a*b^c', expectedBase: 'a*b', expectedExponent: 'c' },
            { input: 'b^c+a', expectedBase: 'b', expectedExponent: 'c+a' },
        ];

        inputs.forEach((test) => {
            it(`Should parse '${test.input}' => base: '${test.expectedBase}' and expression: '${test.expectedExponent}'`, () => {
                const result = StringFormatter.parsePowerFactor(test.input);
                expect(result.base).toEqual(test.expectedBase);
                expect(result.exponent).toEqual(test.expectedExponent);
            });
        });
    });

    describe('parseFactorStrings', () => {
        const inputs: { input: string, expectedResult: string[] }[] = [
            { input: 'a', expectedResult: ['a']},
            { input: '-a', expectedResult: ['-a']},
            { input: '(-a)', expectedResult: ['(-a)']},
            { input: 'a*b', expectedResult: ['a', 'b'] },
            { input: 'sin[a]*b', expectedResult: ['sin[a]', 'b'] },
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
            { input: 'ln[x]*-a/-b/c', expectedResult: ['ln[x]','-a/-b/c'] },
            { input: '-a/-b/c*ln[x]', expectedResult: ['-a/-b/c', 'ln[x]'] },
            { input: '(a)*b', expectedResult: ['(a)','b'] },
            { input: '(a)*(b)', expectedResult: ['(a)','(b)'] },
            { input: '-(a)*-(b)', expectedResult: ['-(a)','-(b)'] },
            { input: '-tan[x*log[y]]',expectedResult: ['-tan[x*log[y]]']},
            { input: '-sec[ln[x]*log[y]]',expectedResult: ['-sec[ln[x]*log[y]]']},
            { input: '-sec[ln[x]]*log[y]',expectedResult: ['-sec[ln[x]]','log[y]']},
            { input: '-cot[x-b]^(c)*((e)/(f))', expectedResult: ['-cot[x-b]^(c)', '((e)/(f))']}
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
            { input: 'sin[(a)]', start: 4, expectedResult: 6 },
            { input: 'sin[(a)]', start: 6, expectedResult: 4 },
        ];

        inputs.forEach((test) => {
            it(`Should return index ${test.expectedResult}, start: ${test.start} in '${test.input}'`, () => {
                const result = StringFormatter.getMatchingParenthesisIndex(test.input, test.start);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('getMatchingBracketIndex', () => {
        const inputs: { input: string, start: number; expectedResult: number }[] = [
            { input: 'sin[a]', start: 3, expectedResult: 5 },
            { input: 'sin[a]', start: 5, expectedResult: 3 },
            { input: 'sin[a]', start: 1, expectedResult: -1 },
            { input: 'cos[a]*3', start: 3, expectedResult: 5 },
            { input: 'cos[a]*3', start: 3, expectedResult: 5 },
            { input: 'x*tan[a]', start: 5, expectedResult: 7 },
            { input: 'x*tan[a]', start: 5, expectedResult: 7 },
            { input: 'csc[a ]* 3', start: 3, expectedResult: 6 },
            { input: 'csc[a ]* 3', start: 6, expectedResult: 3 },
            { input: 'cos[a]*3', start: 0, expectedResult: -1 },
            { input: 'cos[a]*3', start: 0, expectedResult: -1 },
            { input: 'cos[a]*3', start: 0, expectedResult: -1 },
            { input: 'cos[(b+sin[a^tan[x]])]*3', start: 10, expectedResult: 19 },
            { input: 'cos[(b+sin[a^tan[x]])]*3', start: 19, expectedResult: 10 },
            { input: 'cos[(b+sin[a^tan[x]])]*3', start: 16, expectedResult: 18 },
            { input: 'cos[(b+sin[a^tan[x]])]*3', start: 18, expectedResult: 16 },
            { input: 'cos[(b+sin[a^tan[x]])]*3', start: 1, expectedResult: -1 },
        ];

        inputs.forEach((test) => {
            it(`Should return index ${test.expectedResult}, start: ${test.start} in '${test.input}'`, () => {
                const result = StringFormatter.getMatchingBracketIndex(test.input, test.start);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('ensureSurroundingParenthesis', () => {
        const inputs: { input: string, expectedResult: string }[] = [
            { input: '', expectedResult: '()' },
            { input: '   a', expectedResult: '(   a)' },
            { input: '   a)', expectedResult: '(   a))' },
            { input: '(   a', expectedResult: '((   a)' },
            { input: 'a', expectedResult: '(a)' },
            { input: '(a)', expectedResult: '(a)' },
            { input: '-(a)', expectedResult: '(-(a))' },
            { input: '((((a))))', expectedResult: '((((a))))' },
            { input: '(a+b)*(x-y)^(t)', expectedResult: '((a+b)*(x-y)^(t))' },
            { input: '-(a+b)*(x-y)^(t)', expectedResult: '(-(a+b)*(x-y)^(t))' },
            { input: '(a)/b', expectedResult: '((a)/b)' },
            { input: '(a)/(b)', expectedResult: '((a)/(b))' },
        ];

        inputs.forEach((test) => {
            it(`Should transform '${test.input}' to '${test.expectedResult}'`, () => {
                const result = StringFormatter.ensureSurroundingParenthesis(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('stripSurroundingParenthesis', () => {
        const inputs: { input: string, expectedResult: string }[] = [
            { input: '(a)', expectedResult: 'a' },
            { input: '-(a)', expectedResult: 'a' },
            { input: '-(-a)', expectedResult: '-a' },
            { input: '(a)*a', expectedResult: '(a)*a' },
            { input: '(ln[(a+b)])', expectedResult: 'ln[(a+b)]' },
            { input: 'ln[(a+b)]', expectedResult: 'ln[(a+b)]' },
            { input: '(a*sin[(a+b)])', expectedResult: 'a*sin[(a+b)]' },
            { input: '-(a*sin[(a+b)])', expectedResult: 'a*sin[(a+b)]' },
            { input: '-(a)(b)', expectedResult: '-(a)(b)' },
            { input: '-(a)*(b)', expectedResult: '-(a)*(b)' },
            { input: '(a)^(b)', expectedResult: '(a)^(b)' },
            { input: '(a)/(b)', expectedResult: '(a)/(b)' },
            { input: '((a)/(b))', expectedResult: '(a)/(b)' },
            { input: '-((a)/(b))', expectedResult: '(a)/(b)' },
        ];

        inputs.forEach((test) => {
            it(`Should remove () appropriately: '${test.input}' => '${test.expectedResult}'`, () => {
                const result = StringFormatter.stripSurroundingParenthesis(test.input);
                expect(result).toEqual(test.expectedResult);
            });
        });
    });

    describe('getFunctionContents', () => {
        const inputs: { input: string, expectedResult: string[] }[] = [
            { input: 'sin[x]', expectedResult: ['x']},
            { input: '-sin[x]', expectedResult: ['x']},
            { input: 'sin[(x)]', expectedResult: ['(x)']},
            { input: '-ln[x]', expectedResult: ['x']},
            { input: '-log[x,3]', expectedResult: ['x', '3']},
            { input: '-log[-(x),3]', expectedResult: ['-(x)', '3']},
            { input: '-log[log[a],3]', expectedResult: ['log[a]', '3']},
            { input: '-log[log[a,x],3]', expectedResult: ['log[a,x]', '3']},
            { input: '-log[log[a^b,2]+log[a+log[x,a+b],x],3]', expectedResult: ['log[a^b,2]+log[a+log[x,a+b],x]', '3']},
            { input: '-log[log[sin[b]],3]', expectedResult: ['log[sin[b]]', '3']},
            { input: 'log[3,]', expectedResult: ['3', '']},
            { input: 'log[3,,]', expectedResult: ['3', '', '']},
            { input: 'log[,3]', expectedResult: ['', '3']},
            { input: 'log[,]', expectedResult: ['', '']},
            { input: 'log[,3,]', expectedResult: ['', '3', '']},
            { input: 'log[,,3]', expectedResult: ['', '', '3']},
            { input: 'log[,,]', expectedResult: ['', '', '']},
        ];

        inputs.forEach((test) => {
            it(`Should remove () appropriately: '${test.input}' => '${test.expectedResult}'`, () => {
                const result = StringFormatter.getFunctionContents(test.input);
                // console.log('RESULT', result);
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

});

