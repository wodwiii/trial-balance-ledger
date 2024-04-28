const RouteCheck = () =>{
    try {
        const id = localStorage.getItem("id");
        if(id){
            return true;
        }
    } catch (error) {
        
    }
    
}
export default RouteCheck;