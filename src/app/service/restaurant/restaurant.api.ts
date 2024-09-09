
export async function save(restaurant: RestaurantModel): Promise<any | {status: number}> {
    try {
        const restaurantModel = {
            id: restaurant.id,
            name: restaurant.name,
            tel: restaurant.tel,
            address: restaurant.address,
            operateTime: restaurant.operateTime
        }
        console.log(restaurantModel)
        const response = await fetch('http://localhost:8080/restaurant/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(restaurantModel)
            
        });
        const data: any = await response.json();
        return data;

    } catch (e) {
        console.log('There has been a problem with your fetch operation', e);
        return {status: 500 };
    }
}