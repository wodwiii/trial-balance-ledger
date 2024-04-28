export async function loadJournals(userId: any) {
    try {
      const response = await fetch(`https://tbl-nodeserver.vercel.app/api/journals/${userId}`);
      if (response.ok) {
        const journals = await response.json();
        return journals;
      } else {
        console.error('Failed to load journals:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error during loading journals:', error);
      return null;
    }
  }
