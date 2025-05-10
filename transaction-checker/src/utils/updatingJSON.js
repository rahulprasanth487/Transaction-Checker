export const writeToJsonFile = async (data) => {
  try {
      const response = await fetch('http://localhost:3001/api/updateJson', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      });
      
      if (!response.ok) {
          throw new Error('Failed to update JSON file');
      }
      
      return true;
  } catch (error) {
      console.error('Error updating JSON file:', error);
      return false;
  }
};