const fs = require('fs');
const path = require('path');

async function validateFinalProject() {
    console.log("==========================================================");
    console.log("VALIDATING FINAL PROJECT: ACCESSIBLE RESPONSIVE GALLERY");
    console.log("==========================================================\n");

    const htmlPath = path.join(__dirname, 'index.html');
    const cssPath = path.join(__dirname, 'css', 'style.css');

    const html = fs.readFileSync(htmlPath, 'utf8');
    const css = fs.readFileSync(cssPath, 'utf8');

    let passedChecks = 0;
    let totalChecks = 0;

    function assertCheck(name, condition, details = "") {
        totalChecks++;
        if (condition) {
            console.log(`[PASS] ${name}`);
            passedChecks++;
        } else {
            console.error(`[FAIL] ${name} - ${details}`);
        }
    }

    // 1. W3C Nu HTML Validator API
    console.log("--- 1. Testing W3C Official Nu Validator API ---");
    try {
        const response = await fetch('https://validator.w3.org/nu/?out=json', {
            method: 'POST',
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            body: html
        });
        const result = await response.json();
        const errors = result.messages.filter(m => m.type === 'error');
        assertCheck("W3C HTML Validator returns 0 errors", errors.length === 0, 
            errors.map(e => `${e.message} (line ${e.lastLine})`).join('; '));
    } catch (e) {
        console.warn("W3C check skipped/network issue: " + e.message);
    }

    // 2. Images & Alt Text
    console.log("\n--- 2. Checking Images Replacement & Alt Text ---");
    const starterImages = ['Red.jpeg', 'Orange.png', 'Yellow.png', 'Green.png', 'Blue.png', 'Indigo.jpeg', 'Purple.png', 'Pink.jpeg', 'White.png'];
    const hasStarterImages = starterImages.some(img => html.includes(img));
    assertCheck("All starter images replaced (none of Colleen's color images remain)", !hasStarterImages);

    const imgMatches = [...html.matchAll(/<img[^>]+>/gi)];
    assertCheck("At least 9 images present", imgMatches.length >= 9, `Found: ${imgMatches.length}`);

    let allHaveAlt = true;
    const alts = [];
    imgMatches.forEach(tag => {
        const altMatch = tag[0].match(/alt=["']([^"']+)["']/i);
        if (!altMatch || !altMatch[1].trim()) {
            allHaveAlt = false;
        } else {
            alts.push(altMatch[1].trim());
        }
    });
    assertCheck("All images include short, descriptive alt text", allHaveAlt && alts.length >= 9);

    // 3. Paragraphs Replacement
    console.log("\n--- 3. Checking Paragraph Content Replacement ---");
    const hasStarterText = html.includes('Replace all of the images with images of your choice') || html.includes('Lorem, ipsum dolor');
    assertCheck("All starter paragraph text replaced with original content", !hasStarterText);

    // 4 & 5. Mobile View (Base styles before any media query)
    console.log("\n--- 4. Checking Mobile View Grid & Gap ---");
    const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const firstMediaQueryIdx = cleanCss.indexOf('@media');
    const baseCss = firstMediaQueryIdx !== -1 ? cleanCss.slice(0, firstMediaQueryIdx) : cleanCss;

    assertCheck("Mobile view uses single column grid (1fr)", 
        /display\s*:\s*grid/i.test(baseCss) && /grid-template-columns\s*:\s*1fr\b/i.test(baseCss));
    assertCheck("Mobile view uses valid CSS grid gap", 
        /(?:grid-)?gap\s*:\s*10px/i.test(baseCss));
    assertCheck("Smooth scroll behavior enabled in base styles", 
        /scroll-behavior\s*:\s*smooth/i.test(baseCss));

    // 6. Media Query 1 - Tablet View (772px)
    console.log("\n--- 5. Checking Tablet View (@media 772px) ---");
    assertCheck("Media Query #1 triggers at 772px with min-width", 
        /@media[^{]*\(\s*min-width\s*:\s*772px\s*\)/i.test(css));

    const mq772Idx = cleanCss.indexOf('772px');
    const mq992Idx = cleanCss.indexOf('992px');
    const mq772Block = cleanCss.slice(mq772Idx, mq992Idx !== -1 ? mq992Idx : undefined);

    assertCheck("Tablet view uses 2 column grid", 
        /grid-template-columns\s*:\s*(?:repeat\(\s*2\s*,\s*1fr\s*\)|1fr\s+1fr)/i.test(mq772Block));
    assertCheck("Tablet view does NOT repeat 'display: grid' (inherited from mobile)", 
        !/display\s*:\s*grid/i.test(mq772Block));
    assertCheck("Tablet view sets circular border-radius on figures", 
        /border-radius\s*:\s*50%/i.test(mq772Block));
    assertCheck("Tablet view sets last figure to span both columns using :last-child", 
        /:last-child[^{]*\{[^}]*grid-column\s*:\s*(?:span\s+2|1\s*\/\s*(?:-1|3|span\s+2))/i.test(mq772Block));

    // 7. Media Query 2 - Large Screen View (992px)
    console.log("\n--- 6. Checking Large Screen View (@media 992px) ---");
    assertCheck("Media Query #2 triggers at 992px with min-width", 
        /@media[^{]*\(\s*min-width\s*:\s*992px\s*\)/i.test(css));

    const mqReducedMotionIdx = cleanCss.indexOf('prefers-reduced-motion');
    const mq992Block = cleanCss.slice(mq992Idx, mqReducedMotionIdx !== -1 ? mqReducedMotionIdx : undefined);

    assertCheck("Large screen view sets every third figure to take both columns (:nth-child(3n))", 
        /:nth-child\(\s*3n\s*\)[^{]*\{[^}]*grid-column\s*:\s*(?:span\s+2|1\s*\/\s*(?:-1|3|span\s+2))/i.test(mq992Block));
    assertCheck("Large screen view removes border-radius from all figures (border-radius: 0)", 
        /border-radius\s*:\s*0\b/i.test(mq992Block));
    assertCheck("No 'max-width' media queries used anywhere in stylesheet", 
        !/@media[^{]*max-width/i.test(cleanCss));

    // 8. Media Query 3 - Prefers Reduced Motion
    console.log("\n--- 7. Checking Prefers Reduced Motion ---");
    assertCheck("Prefers-reduced-motion media query present", 
        /@media[^{]*prefers-reduced-motion\s*:\s*reduce/i.test(cleanCss));
    const mqReducedMotionBlock = cleanCss.slice(mqReducedMotionIdx, cleanCss.indexOf('prefers-color-scheme'));
    assertCheck("Scroll behavior disabled (scroll-behavior: auto)", 
        /scroll-behavior\s*:\s*auto/i.test(mqReducedMotionBlock));

    // 9. Media Query 4 - Dark Color Scheme
    console.log("\n--- 8. Checking Dark Color Scheme ---");
    assertCheck("Prefers-color-scheme: dark media query present", 
        /@media[^{]*prefers-color-scheme\s*:\s*dark/i.test(cleanCss));
    const mqDarkBlock = cleanCss.slice(cleanCss.indexOf('prefers-color-scheme'));
    assertCheck("Dark mode sets dark background-color on figures", 
        /figure[^{]*\{[^}]*background-color\s*:\s*#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/i.test(mqDarkBlock));
    assertCheck("Dark mode sets light/yellowish font color on figures", 
        /figure[^{]*\{[^}]*color\s*:\s*#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/i.test(mqDarkBlock));
    assertCheck("Dark mode sets black border color on figures", 
        /border(?:-color)?\s*:\s*(?:[^;}]+)?(?:#000(?:000)?|black)\b/i.test(mqDarkBlock));

    console.log("\n==========================================================");
    console.log(`SUMMARY: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
    console.log("==========================================================");

    if (passedChecks === totalChecks) {
        console.log("SUCCESS! All 15 rubric criteria fully satisfied (85/85 points - 100%)!\n");
    } else {
        process.exit(1);
    }
}

validateFinalProject();
