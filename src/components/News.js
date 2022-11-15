import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import Newscategories from './Newscategories';
import NewsItem from './NewsItem'
import Loading from './Loading'

function News(props) {
    const [loading, setLoading] = useState(false)
    const [articles, setArticles] = useState([])
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    const mode = props.mode

    const caps = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const fetchData = async () => {
        props.setProgress(40)
        setLoading(true)
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`
        let data = await fetch(url)
        props.setProgress(60)
        let parsed = await data.json()
        props.setProgress(80)
        setArticles(parsed.articles)
        setTotalResults(parsed.totalResults)
        props.setProgress(100)
        setLoading(false)
    }

    const fetchMoreData = async () => {
        props.setProgress(40)
        setLoading(true)
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`
        setPage(page + 1)
        let data = await fetch(url)
        props.setProgress(60)
        let parsed = await data.json()
        props.setProgress(80)
        setArticles(articles.concat(parsed.articles))
        setTotalResults(parsed.totalResults)
        props.setProgress(100)
        setLoading(false)
    }

    useEffect(() => {
        document.title = `${caps(props.category)} | ${process.env.REACT_APP_NAME}`;
        fetchData();
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <Newscategories mode={mode} />
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url ? element.url : element.title}>
                                <NewsItem mode={mode} source={element.source.name ? element.source.name : ''} title={element.title ? element.title : ""} body={element.description ? element.description : ""} imgUrl={element.urlToImage} newsUrl={element.url ? element.url : "/unknown"} author={element.author} date={element.publishedAt} />
                            </div>
                        })}
                    </div>
                    {loading && <div className="d-flex justify-content-center"><Loading /></div>}
                </div>
            </InfiniteScroll>
        </>
    )
}

News.defaultProps = {
    country: 'in',
    pageSize: 5,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News