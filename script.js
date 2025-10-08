document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const blurSlider = document.getElementById('blur-slider');
    const transparencySlider = document.getElementById('transparency-slider');
    const borderSlider = document.getElementById('border-slider');
    const radiusSlider = document.getElementById('radius-slider');
    const bgColorPicker = document.getElementById('bg-color');
    const borderColorPicker = document.getElementById('border-color');
    const noiseToggle = document.getElementById('noise-toggle');
    
    // Value displays
    const blurValueSpan = document.getElementById('blur-value');
    const transparencyValueSpan = document.getElementById('transparency-value');
    const borderValueSpan = document.getElementById('border-value');
    const radiusValueSpan = document.getElementById('radius-value');
    
    // Preview and output
    const previewCard = document.getElementById('preview-card');
    const cssCodeOutput = document.getElementById('css-code-output');
    const copyBtn = document.getElementById('copy-btn');
    const copySuccessMsg = document.getElementById('copy-success');
    const copyErrorMsg = document.getElementById('copy-error');
    
    // Preset buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // Default values for reset functionality
    const defaultValues = {
        blur: 10,
        transparency: 0.2,
        border: 1,
        radius: 20,
        bgColor: '#ffffff',
        borderColor: '#ffffff',
        noise: false
    };
    
    // Initialize the generator
    function init() {
        // Set up event listeners
        setupEventListeners();
        
        // Generate initial CSS
        generateCss();
        
        // Check browser support
        checkBrowserSupport();
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Input controls
        const controls = [blurSlider, transparencySlider, borderSlider, radiusSlider, bgColorPicker, borderColorPicker, noiseToggle];
        controls.forEach(control => {
            control.addEventListener('input', debounce(generateCss, 100));
        });
        
        // Copy button
        copyBtn.addEventListener('click', handleCopy);
        
        // Preset buttons
        presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const preset = button.dataset.preset;
                applyPreset(preset);
            });
        });
        
        // Keyboard navigation for presets
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        applyPreset('frosted');
                        break;
                    case '2':
                        e.preventDefault();
                        applyPreset('smoky');
                        break;
                    case '3':
                        e.preventDefault();
                        applyPreset('crystal');
                        break;
                    case '0':
                        e.preventDefault();
                        applyPreset('reset');
                        break;
                }
            }
        });
    }
    
    // Debounce function to limit rapid updates
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Main CSS generation function
    function generateCss() {
        // Get current values
        const blur = blurSlider.value;
        const transparency = transparencySlider.value;
        const border = borderSlider.value;
        const radius = radiusSlider.value;
        const bgColor = hexToRgba(bgColorPicker.value, transparency);
        const borderColor = hexToRgba(borderColorPicker.value, 0.5);
        const hasNoise = noiseToggle.checked;
        
        // Update value displays
        blurValueSpan.textContent = blur;
        transparencyValueSpan.textContent = transparency;
        borderValueSpan.textContent = border;
        radiusValueSpan.textContent = radius;
        
        // Update preview card
        updatePreview(blur, bgColor, border, borderColor, radius, hasNoise);
        
        // Generate and display CSS code
        const cssCode = generateCssCode(blur, bgColor, border, borderColor, radius, hasNoise);
        cssCodeOutput.textContent = cssCode;
    }
    
    // Update the preview card with current settings
    function updatePreview(blur, bgColor, border, borderColor, radius, hasNoise) {
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
    }
    
    // Generate the CSS code string
    function generateCssCode(blur, bgColor, border, borderColor, radius, hasNoise) {
        return `.glass-effect {
    /* Glassmorphism Effect */
    background: ${bgColor};
    border-radius: ${radius}px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(${blur}px);
    -webkit-backdrop-filter: blur(${blur}px);
    border: ${border}px solid ${borderColor};
}${hasNoise ? `
    
/* Optional noise texture */
.glass-effect::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.1;
    pointer-events: none;
    border-radius: ${radius}px;
}` : ''}`;
    }
    
    // Convert hex color to rgba
    function hexToRgba(hex, alpha) {
        // Handle shorthand hex (#fff)
        hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => {
            return '#' + r + r + g + g + b + b;
        });
        
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) {
            return `rgba(255, 255, 255, ${alpha})`; // Fallback to white
        }
        
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Handle copy to clipboard
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(cssCodeOutput.textContent);
            showFeedback(copySuccessMsg, copyErrorMsg);
        } catch (err) {
            console.error('Failed to copy: ', err);
            showFeedback(copyErrorMsg, copySuccessMsg);
            
            // Fallback for older browsers
            fallbackCopy();
        }
    }
    
    // Show feedback message
    function showFeedback(successElement, errorElement) {
        successElement.style.opacity = '1';
        errorElement.style.opacity = '0';
        
        setTimeout(() => {
            successElement.style.opacity = '0';
        }, 2000);
    }
    
    // Fallback copy method for older browsers
    function fallbackCopy() {
        const textArea = document.createElement('textarea');
        textArea.value = cssCodeOutput.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showFeedback(copySuccessMsg, copyErrorMsg);
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            showFeedback(copyErrorMsg, copySuccessMsg);
        }
        
        document.body.removeChild(textArea);
    }
    
    // Apply preset configurations
    function applyPreset(preset) {
        const presets = {
            'frosted': {
                blur: 15,
                transparency: 0.25,
                border: 1,
                radius: 25,
                bgColor: '#ffffff',
                borderColor: '#ffffff',
                noise: true
            },
            'smoky': {
                blur: 20,
                transparency: 0.15,
                border: 0,
                radius: 15,
                bgColor: '#000000',
                borderColor: '#ffffff',
                noise: false
            },
            'crystal': {
                blur: 30,
                transparency: 0.1,
                border: 2,
                radius: 10,
                bgColor: '#ffffff',
                borderColor: '#ffffff',
                noise: false
            },
            'reset': defaultValues
        };
        
        const presetConfig = presets[preset];
        if (presetConfig) {
            // Update controls with preset values
            blurSlider.value = presetConfig.blur;
            transparencySlider.value = presetConfig.transparency;
            borderSlider.value = presetConfig.border;
            radiusSlider.value = presetConfig.radius;
            bgColorPicker.value = presetConfig.bgColor;
            borderColorPicker.value = presetConfig.borderColor;
            noiseToggle.checked = presetConfig.noise;
            
            // Generate CSS with new values
            generateCss();
        }
    }
    
    // Check browser support for backdrop-filter
    function checkBrowserSupport() {
        const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)') || 
                                     CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
        
        if (!supportsBackdropFilter) {
            console.warn('Backdrop filter not supported in this browser');
            // You could show a more prominent warning to the user here
        }
    }
    
    // Initialize the application
    init();
});
