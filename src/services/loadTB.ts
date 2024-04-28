export async function loadTB(userId: any) {
    try {
      const response = await fetch(`https://tbl-nodeserver.vercel.app/api/get-tbl/${userId}`);
      if (response.ok) {
        const journals = await response.json();
        return journals;
      } else {
        console.error('Failed to load trialbalance:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error during loading trialbalance:', error);
      return null;
    }
  }