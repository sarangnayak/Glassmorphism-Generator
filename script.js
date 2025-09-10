document.addEventListener('DOMContentLoaded', () => {
    
    const blurSlider = document.getElementById('blur-slider');
    const transparencySlider = document.getElementById('transparency-slider');
    const borderSlider = document.getElementById('border-slider');
    const radiusSlider = document.getElementById('radius-slider');
    const bgColorPicker = document.getElementById('bg-color');
    const borderColorPicker = document.getElementById('border-color');
    const noiseToggle = document.getElementById('noise-toggle');

    
    const blurValueSpan = document.getElementById('blur-value');
    const transparencyValueSpan = document.getElementById('transparency-value');
    const borderValueSpan = document.getElementById('border-value');
    const radiusValueSpan = document.getElementById('radius-value');

    
    const previewCard = document.getElementById('preview-card');
    const cssCodeOutput = document.getElementById('css-code-output');
    const copyBtn = document.getElementById('copy-btn');
    const copySuccessMsg = document.querySelector('.copy-success');

    const generateCss = () => {
        
        const blur = blurSlider.value;
        const transparency = transparencySlider.value;
        const border = borderSlider.value;
        const radius = radiusSlider.value;
        const bgColor = hexToRgba(bgColorPicker.value, transparency);
        const borderColor = hexToRgba(borderColorPicker.value, 0.5); 
        const hasNoise = noiseToggle.checked;

        
        blurValueSpan.textContent = blur;
        transparencyValueSpan.textContent = transparency;
        borderValueSpan.textContent = border;
        radiusValueSpan.textContent = radius;
        
        
        previewCard.style.backdropFilter = `blur(${blur}px)`;
        previewCard.style.webkitBackdropFilter = `blur(${blur}px)`;
        previewCard.style.backgroundColor = bgColor;
        previewCard.style.border = `${border}px solid ${borderColor}`;
        previewCard.style.borderRadius = `${radius}px`;

        if (hasNoise) {
            previewCard.classList.add('noise');
        } else {
            previewCard.classList.remove('noise');
        }

        
        const cssCode = `
.glass-effect {
    /* From https://css.glass */
    background: ${bgColor};
    border-radius: ${radius}px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(${blur}px);
    -webkit-backdrop-filter: blur(${blur}px);
    border: ${border}px solid ${borderColor};
}
${hasNoise ? 
`
.glass-effect::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.1;
    pointer-events: none;
}` : ''}
`;
        cssCodeOutput.textContent = cssCode.trim();
    };

    
    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    
    const controls = [blurSlider, transparencySlider, borderSlider, radiusSlider, bgColorPicker, borderColorPicker, noiseToggle];
    controls.forEach(control => {
        control.addEventListener('input', generateCss);
    });
    
    
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(cssCodeOutput.textContent).then(() => {
            copySuccessMsg.style.opacity = '1';
            setTimeout(() => {
                copySuccessMsg.style.opacity = '0';
            }, 2000);
        });
    });

    
    generateCss();
});


