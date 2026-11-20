import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import App from '../components/App';
import '@testing-library/jest-dom';

describe("Liking a Toy", () => {
    it("increments likes when the like button is clicked", async () => {
        let toyCards
        let toyCard
        let likes

        global.setFetchResponse([{
            "id": 1,
            "name": "Woody",
            "image": "http://www.pngmart.com/files/3/Toy-Story-Woody-PNG-Photos.png",
            "likes": 8
        }])

        const app = render(<App />);

        const likeButton = await app.findByText("Like <3")

        global.setFetchResponse({
            "id": 1,
            "name": "Woody",
            "image": "http://www.pngmart.com/files/3/Toy-Story-Woody-PNG-Photos.png",
            "likes": 9
        })
        const patchFetch = global.fetch;

        fireEvent.click(likeButton);

        toyCards = await app.findAllByTestId('toy-card')
        toyCard = toyCards[0]
        likes = parseInt(toyCard.querySelector('p').textContent.split(' ')[0])
        
        expect(likes).toBe(9);
        expect(patchFetch).toHaveBeenCalledWith("http://localhost:3001/toys/1", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ likes: 9 }),
        });

        global.setFetchResponse({
            "id": 1,
            "name": "Woody",
            "image": "http://www.pngmart.com/files/3/Toy-Story-Woody-PNG-Photos.png",
            "likes": 10
        })

        fireEvent.click(likeButton);

        toyCards = await app.findAllByTestId('toy-card')
        toyCard = toyCards[0]
        likes = parseInt(toyCard.querySelector('p').textContent.split(' ')[0])
        
        expect(likes).toBe(10);
    });
});
  