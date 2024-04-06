// Write your code here
import {Component} from 'react'
import {Loader} from 'react-loader-spinner'
import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamMatchesData: {},
  }

  componentDidMount() {
    this.getTeamObj()
  }

  getFormattedData = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.math_status,
  })

  getTeamObj = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response =  await fetch(`https://apis.ccbp.in/blogs/${id}`)
    const responseData = await response.json()
    const formattedData = {
      teamBannerUrl: responseData.team_banner_url,
      latestMatch: this.getFormattedData(responseData.latest_match_details),
      recentMatches: responseData.recent_matches.map(eachOne =>
        this.getFormattedData(eachOne),
      ),
    }

    this.setState({
      isLoading: false,
      teamMatchesData: formattedData,
    })
  }

  renderLatestMatch = () => {
    const {teamMatchesData} = this.state
    const {teamBannerUrl, latestMatch} = teamMatchesData

    return (
      <div>
        <img src={teamBannerUrl} alt="team banner" />
        <LatestMatch matchDetails={latestMatch} />
        {this.renderRecentMatches()}
      </div>
    )
  }

  renderRecentMatches = () => {
    const {teamMatchesData} = this.state
    const {recentMatches} = teamMatchesData
    return (
      <ul>
        {recentMatches.map(eachMatch => (
          <MatchCard recentMatchDetails={eachMatch} key={eachMatch.id} />
        ))}
      </ul>
    )
  }
  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="Oval" color="black" height={50} />
    </div>
  )

  render() {
    const {isLoading} = this.state
    return (
      <div>{isLoading ? this.renderLoader() : this.renderLatestMatch()}</div>
    )
  }
}
export default TeamMatches
