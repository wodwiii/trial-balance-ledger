const RouteCheck = () =>{
    try {
        const email = localStorage.getItem("email");
        const password = localStorage.getItem("pass");
        if(email && password){
            return true;
        }
    } catch (error) {
        
    }
    
}
export default RouteCheck;