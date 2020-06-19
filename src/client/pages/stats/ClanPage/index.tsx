import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

import { Loader } from '../../../components/Loader';

import { IClanFormat } from 'corehalla.js';

export const ClanStatsPage: React.FC = () => {
    const sections = ['teams', 'legends', 'weapons'];
    const hash = window.location.hash.substring(1);

    const [,] = useState(sections.includes(hash) ? hash : 'overview');

    const [loading, setLoading] = useState(true);
    const [clanStats, setClanStats] = useState<IClanFormat>();

    useEffect(() => {
        const timeout = setTimeout(async () => {
            const { ClanStats } = await import('../../../mockups/Clan');
            setClanStats(ClanStats);
            setLoading(false);
        }, 250);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="PlayerPage">
            {loading ? (
                <Loader />
            ) : (
                <>
                    {clanStats.name}
                    <h3>Leader</h3>
                    <div className="clan-members-container">
                        {clanStats.members.Leader.map((member) => (
                            <div className="card" key={member.id}>
                                <Link to={`/stats/player/${member.id}`}>{member.name}</Link>
                            </div>
                        ))}
                    </div>
                    <h3>Officers</h3>
                    <div className="clan-members-container">
                        {clanStats.members.Officer.map((member) => (
                            <div className="card" key={member.id}>
                                <Link to={`/stats/player/${member.id}`}>{member.name}</Link>
                            </div>
                        ))}
                    </div>
                    <h3>Members</h3>
                    <div className="clan-members-container">
                        {clanStats.members.Member.map((member) => (
                            <div className="card" key={member.id}>
                                <Link to={`/stats/player/${member.id}`}>{member.name}</Link>
                            </div>
                        ))}
                    </div>
                    <h3>Recruits</h3>
                    <div className="clan-members-container">
                        {clanStats.members.Recruit.map((member) => (
                            <div className="card" key={member.id}>
                                <Link to={`/stats/player/${member.id}`}>{member.name}</Link>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
