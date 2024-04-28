export async function createJournal(name: any, owner: any) {
    try {
      const response = await fetch('https://tbl-nodeserver.vercel.app/api/journals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, owner }),
      });
  
      if (response.ok) {
        const journal = await response.json();
        return journal;
      } else {
        console.error('Failed to create journal:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error during journal creation:', error);
      return null;
    }
  }