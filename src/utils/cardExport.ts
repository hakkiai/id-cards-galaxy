
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
    
    const canvas = await html2canvas(element, {
      scale: 3, // Higher scale for better quality
      backgroundColor: '#ffffff', // White background instead of transparent
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageRendering: 'auto',
      letterRendering: true,
      removeContainer: false,
    });
    
    // Remove export mode class
    element.classList.remove('card-for-export');
    
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
    
    // Convert all elements to canvas and add to zip
    for (let i = 0; i < elements.length; i++) {
      // Apply export mode class
      elements[i].classList.add('card-for-export');
      
      const canvas = await html2canvas(elements[i], {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageRendering: 'auto',
        letterRendering: true
      });
      
      // Remove export mode class
      elements[i].classList.remove('card-for-export');
      
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
