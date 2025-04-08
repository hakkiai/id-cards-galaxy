
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
    
    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none'; // Reset any transformations
    clone.style.position = 'fixed';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.zIndex = '-1000';
    clone.style.width = '350px';
    clone.style.height = '550px';
    document.body.appendChild(clone);
    
    const canvas = await html2canvas(clone, {
      scale: 6, // Increased for better quality (was 4)
      backgroundColor: '#ffffff', // White background instead of transparent
      useCORS: true,
      allowTaint: true,
      logging: false,
      removeContainer: true,
      onclone: (clonedDoc, clonedElement) => {
        // Additional styling tweaks to ensure proper rendering
        const allElements = clonedElement.querySelectorAll('*');
        allElements.forEach(el => {
          if (el instanceof HTMLElement) {
            // Ensure all text elements maintain their properties
            el.style.textRendering = 'geometricPrecision';
            // Force all elements to render at full quality
            el.style.willChange = 'transform';
          }
        });
      }
    });
    
    // Remove the clone after capture
    document.body.removeChild(clone);
    
    // Remove export mode class from original
    element.classList.remove('card-for-export');
    
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/jpeg', 1.0); // Maximum quality
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
      document.body.appendChild(clone);
      
      const canvas = await html2canvas(clone, {
        scale: 6, // Increased for better quality (was 4)
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        removeContainer: true,
        onclone: (clonedDoc, clonedElement) => {
          // Additional styling tweaks to ensure proper rendering
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.textRendering = 'geometricPrecision';
              el.style.willChange = 'transform';
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
