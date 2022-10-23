import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()
//Provider, Consumer - GithubContext.Provider

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)
  // request loading
  const [requests, setRequests] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  // error section
  const [error, setError] = useState({ show: false, msg: '' })

  const searchGithubUser = async (user) => {
    toggleError()
    setIsLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    )

    console.log(response)
    if (response) {
      setGithubUser(response.data)
      const { login, repos_url, followers_url } = response.data
      console.log(followers_url)

      await Promise.allSettled([
        axios(`${repos_url}`),
        axios(`${followers_url}`),
      ]).then((results) => {
        const [repos, followers] = results
        const status = 'fulfilled'
        if (repos.status === status) {
          console.log("Repos' Data")
          console.log(repos.value.data)
          setRepos(repos.value.data)
          // setRepos(repos.data)
        }
        if (followers.status === status) {
          console.log("Followers' Data")
          console.log(followers.value.data)
          setFollowers(followers.value.data)
          // setFollowers(followers.data)
        }
      })
    } else {
      toggleError(true, 'there is no user with that username')
    }
    checkRequests()
    setIsLoading(false)
  }

  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data
        // remaining = 0
        setRequests(remaining)
        if (remaining === 0) {
          toggleError(true, 'sorry, you have exceeded your hourly limit')
        }
      })
      .catch((err) => console.log(err))
  }

  function toggleError(show, msg) {
    setError({ show, msg })
  }

  // error
  useEffect(checkRequests, [])

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export { GithubProvider, GithubContext }
