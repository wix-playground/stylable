import { browserFunctions, StylableProjectRunner } from '@stylable/e2e-test-kit';
import { expect } from 'chai';
import { join } from 'path';

const project = 'mixins-project';

describe(`(${project})`, () => {
    const projectRunner = StylableProjectRunner.mochaSetup(
        {
            projectDir: join(__dirname, 'projects', project),
            port: 3001,
            puppeteerOptions: {
                // headless: false
            }
        },
        before,
        afterEach,
        after
    );

    it('renders css', async () => {
        const { page } = await projectRunner.openInBrowser();
        const styleElements = await page.evaluate(browserFunctions.getStyleElementsMetadata, true);

        expect(styleElements[0]).to.include({
            id: './src/index.st.css',
            depth: '1'
        });
        expect(styleElements[0].css.replace(/\s\s*/gm, ' ').trim()).to.equal(
            `.o0--root { arguments: ["1","2"]; border: 1px solid rgb(255, 0, 0); z-index: 9; }`
        );
    });

    it('css is working', async () => {
        const { page } = await projectRunner.openInBrowser();
        const backgroundColor = await page.evaluate(() => {
            return getComputedStyle(document.documentElement).border;
        });

        expect(backgroundColor).to.eql('1px solid rgb(255, 0, 0)');
    });
});
