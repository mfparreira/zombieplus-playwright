require('dotenv').config()

const { expect } = require('@playwright/test')
export class Api {

    constructor(request) {
        this.request = request
        this.token = undefined
        this.baseApi = process.env.BASE_API

    }

    async setToken() {
        const response = await this.request.post(this.baseApi + '/sessions', {
            data: {
                email: 'admin@zombieplus.com',
                password: 'pwd123'
            }
        })

        expect(response.ok()).toBeTruthy()
        const body = JSON.parse(await response.text())
        this.token = 'Bearer ' + body.token


        console.log(this.token)
    }


    async getCompanyIdByName(companyName) {



        const response = await this.request.get(this.baseApi + '/companies', {
            headers: {
                Authorization: this.token,
            },
            params: {
                name: companyName
            }

        })
        expect(response.ok()).toBeTruthy()

        const body = JSON.parse(await response.text())
        return body.data[0].id
    }

    async postMovie(movie) {

        const companyId = await this.getCompanyIdByName(movie.company)



        const response = await this.request.post(this.baseApi + '/movies', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: movie.title,
                overview: movie.overview,
                company_id: companyId,
                release_year: movie.release_year,
                featured: movie.featured
            }

        })
        expect(response.ok()).toBeTruthy()

    }

    async postTvShow(tvshow) {

        const companyIdTvShow = await this.getCompanyIdByName(tvshow.company)

        const response = await this.request.post(this.baseApi + '/tvshows', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                cover: undefined,
                title: tvshow.title,
                overview: tvshow.overview,
                company_id: companyIdTvShow,
                release_year: tvshow.release_year,
                seasons: tvshow.season,
                featured: false
            }
    })

    expect(response.ok()).toBeTruthy()
    }
}

