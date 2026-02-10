import React from 'react';

import { Link } from '@reach/router';

import { encodeSearchQuery } from '../../utils/searchUtils';

// Renders head words and spellings as links to search.
const HeadWords = (props) => {
    const { headWords, spellings } = props;

    return (
        <>
            {headWords == null && (
                <h5 className="text-muted mt-sm-2">
                    <strong className="flatLinkMuted">
                        <i>No results found for your query!</i>
                    </strong>
                </h5>
            )}
            {headWords != null && (
                <>
                    <h5 className="text-muted mt-sm-2">Results retrieved for:</h5>
                    <ul className="inlineList topList mb-sm-5 mt-sm-3">
                        {headWords?.map((headWord, index) => (
                            <li key={index} className="mgInlineBlock">
                                <Link to={`/search/${encodeSearchQuery(headWord)}`} style={{ textDecoration: 'none' }}>
                                    <strong className="flatLinkMuted">
                                        <i>
                                            &nbsp;"{headWord}"{index === headWords.length - 1 ? ';' : ','}
                                        </i>
                                    </strong>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {spellings?.length > 0 && (
                <h5 className="text-muted">Did you mean...</h5>
            )}
            <ul className="inlineList topList">
                {spellings?.map((spelling, index) => (
                    <li key={index} className="mgInlineBlock">
                        <Link to={`/search/${encodeSearchQuery(spelling)}`} style={{ textDecoration: 'none' }}>
                            <strong className="flatLinkMuted">
                                <i>
                                    &nbsp;"{spelling}"{index === spellings.length - 1 ? '...?' : ','}
                                </i>
                            </strong>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default HeadWords;