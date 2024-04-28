export async function loadTrialBalance(userId: any) {
    try {
      const response = await fetch(`https://tbl-nodeserver.vercel.app/api/get-tbl/${userId}`);
      if (response.ok) {
        const trialBalance = await response.json();
        return trialBalance;
      } else {
        console.error('Failed to load journals:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error during loading journals:', error);
      return null;
    }
  }