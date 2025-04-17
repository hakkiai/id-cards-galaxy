
import html2canvas from 'html2canvas';

/**
 * Convert an HTML element to a JPEG image and download it
 * @param element DOM element to convert
 * @param fileName Name for the downloaded file
 */
export const downloadElementAsJpeg = async (element: HTMLElement, fileName: string) => {
  try {
    // Create a clone to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Apply export mode class to both the original and clone
    element.classList.add('card-for-export');
    clone.classList.add('card-for-export');
    
    // Set up clone for rendering
    clone.style.position = 'fixed';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.zIndex = '-1000';
    clone.style.width = '350px'; // Fixed width
    clone.style.height = '550px'; // Fixed height
    clone.style.transformOrigin = 'top left';
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.border = 'none';
    clone.style.borderRadius = '0';
    clone.style.boxShadow = 'none';
    clone.style.background = '#ffffff';
    clone.style.display = 'block';
    clone.style.overflow = 'visible';
    
    // Append clone to body for rendering
    document.body.appendChild(clone);
    
    // Ensure all images and resources load before capturing
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
    
    // Load all images
    await preloadImages(clone);
    
    // Fix barcode SVG
    const fixSvg = (element: HTMLElement) => {
      const svgElements = element.querySelectorAll('svg');
      svgElements.forEach(svg => {
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.overflow = 'visible';
        svg.style.display = 'block';
        
        // Fix rectangles in barcode
        const rects = svg.querySelectorAll('rect');
        rects.forEach(rect => {
          rect.setAttribute('shape-rendering', 'crispEdges');
          rect.setAttribute('vector-effect', 'non-scaling-stroke');
        });
      });
      
      // Fix SVG containers
      const svgContainers = element.querySelectorAll('div:has(> svg)');
      svgContainers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.style.overflow = 'visible';
          container.style.width = '100%';
          container.style.height = 'auto';
          container.style.display = 'block';
        }
      });
    };
    
    // Apply SVG fixes
    fixSvg(clone);
    
    // Capture the clone with higher resolution
    const canvas = await html2canvas(clone, {
      scale: 4, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      imageTimeout: 0,
      logging: false,
      width: 350, // Match card width
      height: 550, // Match card height - Make sure this captures the full card
      windowWidth: 1200, // Larger context width
      windowHeight: 800, // Larger context height
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      onclone: (doc, cloneEl) => {
        // Apply final styling fixes to ensure proper rendering
        const allElements = cloneEl.querySelectorAll('*');
        allElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.margin = el.style.margin || '0';
            el.style.transform = 'none';
            el.style.transition = 'none';
            el.style.animation = 'none';
            el.style.boxShadow = 'none';
            
            // Use standard CSS properties for text rendering
            el.style.textRendering = 'geometricPrecision';
            // Removed non-standard fontSmoothing and webkitFontSmoothing properties
            
            // Special handling for images
            if (el instanceof HTMLImageElement) {
              el.style.maxWidth = '100%';
              el.style.objectFit = 'cover';
              el.crossOrigin = 'anonymous';
            }
          }
        });
      }
    });
    
    // Remove the clone
    document.body.removeChild(clone);
    
    // Remove export class from original
    element.classList.remove('card-for-export');
    
    // Create a new canvas with padding to ensure nothing is cut off
    const finalCanvas = document.createElement('canvas');
    const padding = 0; // Add padding if needed
    finalCanvas.width = canvas.width + padding * 2;
    finalCanvas.height = canvas.height + padding * 2;
    
    const ctx = finalCanvas.getContext('2d');
    if (ctx) {
      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      // Draw the original canvas with padding
      ctx.drawImage(canvas, padding, padding);
      
      // Download the image
      const link = document.createElement('a');
      link.href = finalCanvas.toDataURL('image/jpeg', 1.0);
      link.download = fileName;
      link.click();
    }
    
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
    
    // Process each card element
    for (let i = 0; i < elements.length; i++) {
      const original = elements[i];
      original.classList.add('card-for-export');
      
      // Create a clone with proper sizing
      const clone = original.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.zIndex = '-1000';
      clone.style.width = '350px';
      clone.style.height = '550px';
      clone.style.transform = 'none';
      clone.style.transformOrigin = 'top left';
      clone.style.margin = '0';
      clone.style.padding = '0';
      clone.style.border = 'none';
      clone.style.borderRadius = '0';
      clone.style.boxShadow = 'none';
      clone.style.background = '#ffffff';
      clone.style.display = 'block';
      clone.style.overflow = 'visible';
      
      document.body.appendChild(clone);
      
      // Fix SVG elements (especially barcodes)
      const svgElements = clone.querySelectorAll('svg');
      svgElements.forEach(svg => {
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.overflow = 'visible';
        svg.style.display = 'block';
        
        // Fix barcode rectangles
        const rects = svg.querySelectorAll('rect');
        rects.forEach(rect => {
          rect.setAttribute('shape-rendering', 'crispEdges');
          rect.setAttribute('vector-effect', 'non-scaling-stroke');
        });
      });
      
      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Capture the card
      const canvas = await html2canvas(clone, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        logging: false,
        width: 350,
        height: 550,
        windowWidth: 1200,
        windowHeight: 800,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        onclone: (doc, cloneEl) => {
          // Apply final fixes
          const allElements = cloneEl.querySelectorAll('*');
          allElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.margin = el.style.margin || '0';
              el.style.transform = 'none';
              el.style.transition = 'none';
              el.style.animation = 'none';
              el.style.boxShadow = 'none';
              el.style.textRendering = 'geometricPrecision';
              // Removed non-standard webkitFontSmoothing property
              
              if (el instanceof HTMLImageElement) {
                el.style.maxWidth = '100%';
                el.style.objectFit = 'cover';
                el.crossOrigin = 'anonymous';
              }
            }
          });
        }
      });
      
      // Remove the clone
      document.body.removeChild(clone);
      original.classList.remove('card-for-export');
      
      // Add to zip
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
