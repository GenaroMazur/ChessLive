export default class UserRating {
    rating: number
    rd: number
    volatility: number
    games: number
    win: number
    lose: number
    draw: number

    constructor(
        rating = 1500,
        rd = 350,
        volatility = 0.06,
        games = 0,
        win = 0,
        lose = 0,
        draw = 0,
    ) {
        this.rating = rating
        this.rd = rd
        this.volatility = volatility
        this.games = games
        this.win = win
        this.lose = lose
        this.draw = draw
    }
}
