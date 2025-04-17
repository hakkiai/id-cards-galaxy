
import html2canvas from 'html2canvas';

/**
 * Convert an HTML element to a JPEG image and download it
 * @param element DOM element to convert
 * @param fileName Name for the downloaded file
 */
export const downloadElementAsJpeg = async (element: HTMLElement, fileName: string) => {
  try {
    // Apply export mode class
    element.classList.add('card-for-export');
    
    // Create a clone to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Reset transformations and position it off-screen for rendering
    clone.style.transform = 'none';
    clone.style.position = 'fixed';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.zIndex = '-1000';
    clone.style.width = '350px';
    clone.style.height = '550px';
    clone.style.borderRadius = '0'; // Ensure consistent border radius
    clone.style.boxShadow = 'none'; // Remove shadows for clean export
    clone.style.overflow = 'visible'; // Ensure everything is visible
    
    // Apply additional export styling
    const style = document.createElement('style');
    style.textContent = `
      * {
        transform: none !important;
        transition: none !important;
        animation: none !important;
        text-rendering: geometricPrecision !important;
        will-change: auto !important;
        letter-spacing: normal !important;
        line-height: normal !important;
        overflow: visible !important;
      }
      img {
        image-rendering: high-quality !important;
        object-fit: cover !important;
      }
      text, p, h1, h2, h3, h4, h5, h6, span {
        font-weight: normal !important;
        text-align: left !important;
      }
      strong, b, .font-bold, .font-semibold {
        font-weight: bold !important;
      }
      svg {
        overflow: visible !important;
        width: 100% !important;
      }
      .bg-white {
        background-color: white !important;
      }
    `;
    
    clone.appendChild(style);
    document.body.appendChild(clone);
    
    // Ensure all images and SVGs are loaded before rendering
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fix image loading
    const preloadImages = async (element: HTMLElement) => {
      const images = element.querySelectorAll('img');
      const promises = Array.from(images).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Continue even if an image fails to load
          }
        });
      });
      return Promise.all(promises);
    };
    
    // Ensure all images are loaded
    await preloadImages(clone);

    // Special handling for barcode SVG
    const barcodeSvg = clone.querySelector('svg');
    if (barcodeSvg) {
      // Ensure the barcode is fully visible
      barcodeSvg.setAttribute('overflow', 'visible');
      barcodeSvg.style.overflow = 'visible';
      barcodeSvg.style.width = '100%';
      barcodeSvg.style.height = '100%';
      
      // Make sure barcode container is properly sized
      const barcodeContainer = barcodeSvg.parentElement;
      if (barcodeContainer) {
        barcodeContainer.style.overflow = 'visible';
        barcodeContainer.style.padding = '3px 10px';
        barcodeContainer.style.width = '100%';
        barcodeContainer.style.height = 'auto';
      }
      
      // Fix specific barcode elements
      const paths = barcodeSvg.querySelectorAll('rect');
      paths.forEach(path => {
        path.setAttribute('vector-effect', 'non-scaling-stroke');
      });
    }
    
    // Render the element with higher resolution
    const canvas = await html2canvas(clone, {
      scale: 24, // Even higher resolution for better quality
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false,
      removeContainer: true,
      imageTimeout: 0, // No timeout for image loading
      onclone: (clonedDoc, clonedElement) => {
        // Add additional styling tweaks to ensure proper rendering
        const allElements = clonedElement.querySelectorAll('*');
        allElements.forEach(el => {
          if (el instanceof HTMLElement) {
            // Ensure all text elements maintain their properties
            el.style.textRendering = 'geometricPrecision';
            
            // Use setAttribute for non-standard properties
            el.setAttribute('style', `${el.getAttribute('style') || ''}; -webkit-font-smoothing: antialiased; overflow: visible !important;`);
            el.style.willChange = 'transform';
            
            // Fix layout shifts
            el.style.position = el.style.position || 'relative';
            
            // Ensure images are rendered correctly
            if (el instanceof HTMLImageElement) {
              el.style.imageRendering = 'high-quality';
              el.crossOrigin = 'anonymous';
              
              // Force reload the image to ensure it's loaded before capture
              const originalSrc = el.src;
              if (originalSrc) {
                el.src = '';
                setTimeout(() => { el.src = originalSrc; }, 10);
              }
            }
            
            // Special handling for SVG elements (especially barcodes)
            if (el.tagName.toLowerCase() === 'svg' || el.querySelector('svg')) {
              el.style.overflow = 'visible';
              el.setAttribute('overflow', 'visible');
              
              const svgElement = el.tagName.toLowerCase() === 'svg' ? el : el.querySelector('svg');
              if (svgElement) {
                svgElement.setAttribute('overflow', 'visible');
                svgElement.style.overflow = 'visible';
                svgElement.style.width = '100%';
                
                // Ensure all child elements of SVG are visible
                const svgChildren = svgElement.querySelectorAll('*');
                svgChildren.forEach(child => {
                  if (child instanceof SVGElement) {
                    child.setAttribute('overflow', 'visible');
                  }
                });
              }
            }
          }
        });
      }
    });
    
    // Remove the clone after capture
    document.body.removeChild(clone);
    
    // Remove export mode class from original
    element.classList.remove('card-for-export');
    
    // Download the image with maximum quality
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
    
    return true;
  } catch (error) {
    console.error('Error downloading as JPEG:', error);
    return false;
  }
};

/**
 * Create a zip file containing multiple JPEG images from HTML elements
 * @param elements Array of DOM elements to convert
 * @param zipFileName Name for the zip file
 * @param namePrefix Prefix for individual file names
 */
export const downloadElementsAsZippedJpegs = async (
  elements: HTMLElement[], 
  zipFileName: string,
  namePrefix: string = 'card'
) => {
  try {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    // Ensure all images are loaded before rendering
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fix image loading
    const preloadImages = async (element: HTMLElement) => {
      const images = element.querySelectorAll('img');
      const promises = Array.from(images).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        });
      });
      return Promise.all(promises);
    };
    
    // Convert all elements to canvas and add to zip
    for (let i = 0; i < elements.length; i++) {
      // Create a clone of the element to avoid modifying the original
      const original = elements[i];
      original.classList.add('card-for-export');
      
      const clone = original.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.position = 'fixed';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.zIndex = '-1000';
      clone.style.width = '350px';
      clone.style.height = '550px';
      clone.style.borderRadius = '0';
      clone.style.boxShadow = 'none';
      
      // Apply additional export styling
      const style = document.createElement('style');
      style.textContent = `
        * {
          transform: none !important;
          transition: none !important;
          animation: none !important;
          text-rendering: geometricPrecision !important;
          will-change: auto !important;
          letter-spacing: normal !important;
          line-height: normal !important;
        }
        img {
          image-rendering: high-quality !important;
          object-fit: cover !important;
        }
        text, p, h1, h2, h3, h4, h5, h6, span {
          font-weight: normal !important;
          text-align: left !important;
        }
        strong, b, .font-bold, .font-semibold {
          font-weight: bold !important;
        }
      `;
      
      clone.appendChild(style);
      document.body.appendChild(clone);
      
      // Ensure all images are loaded
      await preloadImages(clone);
      
      const canvas = await html2canvas(clone, {
        scale: 16, // Even higher resolution for better quality
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        removeContainer: true,
        imageTimeout: 0,
        onclone: (clonedDoc, clonedElement) => {
          // Additional styling tweaks to ensure proper rendering
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.textRendering = 'geometricPrecision';
              
              // Use setAttribute for non-standard properties
              el.setAttribute('style', `${el.getAttribute('style') || ''}; -webkit-font-smoothing: antialiased;`);
              el.style.willChange = 'transform';
              el.style.position = el.style.position || 'relative';
              
              if (el instanceof HTMLImageElement) {
                el.style.imageRendering = 'high-quality';
                el.crossOrigin = 'anonymous';
                
                // Force reload the image
                const originalSrc = el.src;
                if (originalSrc) {
                  el.src = '';
                  setTimeout(() => { el.src = originalSrc; }, 10);
                }
              }
            }
          });
        }
      });
      
      // Remove the clone after capture
      document.body.removeChild(clone);
      
      // Remove export mode class from original
      original.classList.remove('card-for-export');
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0).split(',')[1];
      zip.file(`${namePrefix}_${i + 1}.jpeg`, imgData, {base64: true});
    }
    
    // Generate and download zip
    const content = await zip.generateAsync({type: 'blob'});
    const link = document.createElement('a');
    link.download = zipFileName;
    link.href = URL.createObjectURL(content);
    link.click();
    return true;
  } catch (error) {
    console.error('Error creating zip file:', error);
    return false;
  }
};
