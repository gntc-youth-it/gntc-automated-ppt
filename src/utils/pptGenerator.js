import PptxGenJS from "pptxgenjs";

/**
 * Generates and saves a PPTX file based on the parsed data.
 * @param {Object} data - { title, source, slides }
 */
export const generatePPT = (data) => {
    const { title, source, slides } = data;

    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_16x9'; // 16:9 Aspect Ratio

    // --- Slide 1: Title Slide ---
    const slide1 = pres.addSlide();
    slide1.background = { color: "000000" }; // Black background

    // Title centered, Yellow, Large
    slide1.addText(title, {
        x: 0,
        y: "40%", // Vertically slightly above center
        w: "100%",
        align: "center",
        fontFace: "Arial", // Standard safe font
        fontSize: 54, // Large title
        color: "FFFF00", // Yellow
        bold: true,
    });

    // Source centered, Yellow, Medium, below title
    slide1.addText(source, {
        x: 0,
        y: "55%",
        w: "100%",
        align: "center",
        fontFace: "Arial",
        fontSize: 32,
        color: "FFFF00", // Yellow
        bold: true,
    });

    // --- Slide 2+: Lyrics Slides ---
    slides.forEach((lyrics) => {
        const slide = pres.addSlide();
        slide.background = { color: "000000" };

        // Header: Title (Source) - Top Centered, Small, Yellow
        // Format: "Title (Source)"
        const headerText = `${title} (${source})`;
        slide.addText(headerText, {
            x: 0,
            y: 0.3, // Top margin
            w: "100%",
            align: "center",
            fontFace: "Arial",
            fontSize: 24, // Smaller for header
            color: "FFFF00",
            bold: true,
        });

        // Lyrics: Centered, White, Large
        slide.addText(lyrics, {
            x: 0.5, // Side padding
            y: 1.5, // Start below header
            w: "90%", // Width with padding
            h: "70%",
            align: "center",
            valign: "middle", // Vertically center within the text box
            fontFace: "Arial",
            fontSize: 44, // Large readable lyrics
            color: "FFFFFF", // White
            bold: true,
            lineSpacing: 48, // Good spacing for lyrics
        });
    });

    // Save the presentation
    const fileName = `${title || "worship_lyrics"}.pptx`;
    pres.writeFile({ fileName });
};
