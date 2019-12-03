const fs = require('fs');
const convertXML = require('xml-js');

const staticLegendsDataXML = fs.readFileSync('functions/util/static-data/HeroTypes.xml');
const staticLegendsData = convertXML.xml2js(staticLegendsDataXML, { compact: true }).HeroTypes.HeroType;

module.exports = (legendsStats, legendsRanked) => {
    return new Promise((resolve, reject) => {
        let legends = [];
        staticLegendsData.forEach(hero => {
            const legendStats = legendsStats ? legendsStats.find(l => l.legend_id.toString() === hero.HeroID._text) || {} : {};
            const legendRanked = legendsRanked ? legendsRanked.find(l => l.legend_id.toString() === hero.HeroID._text) || {} : {};
            let weapon_one = getWeaponStats(
                hero.BaseWeapon1._text,
                legendStats.damageweaponone || 0,
                legendStats.koweaponone || 0,
                legendStats.timeheldweaponone || 0
            );
            console.log(weapon_one);

            let weapon_two = getWeaponStats(
                hero.BaseWeapon2._text,
                legendStats.damageweapontwo || 0,
                legendStats.koweapontwo || 0,
                legendStats.timeheldweapontwo || 0
            );

            let unarmed = getWeaponStats(
                'Unarmed',
                legendStats.damageunarmed || 0,
                legendStats.kounarmed || 0,
                legendStats.matchtime - (legendStats.timeheldweaponone + legendStats.timeheldweapontwo) || 0
            );

            let gadgets = {
                damage_dealt: legendStats.damagegadgets || 0,
                kills: legendStats.kogadgets || 0
            };

            let throws = {
                damage_dealt: legendStats.damagethrownitem || 0,
                kills: legendStats.kothrownitem || 0
            };

            let legend = {
                id: hero.HeroID._text,
                name: hero.HeroDisplayName._text,
                overall: {
                    level: legendStats.level || 0,
                    xp: legendStats.xp || 0,
                    xp_percentage: legendStats.xp_percentage || 0,
                    damage: {
                        dealt: legendStats.damagedealt || 0,
                        taken: legendStats.damagetaken || 0
                    },
                    kos: {
                        kills: legendStats.kos || 0,
                        falls: legendStats.falls || 0,
                        suicides: legendStats.suicides || 0,
                        team_kills: legendStats.teamkos || 0
                    },
                    matchTime: legendStats.matchtime || 0,
                    games: {
                        total_games: legendStats.games || 0,
                        wins: legendStats.wins || 0,
                        losses: legendStats.games - legendStats.wins || 0
                    },
                    weapons: { weapon_one, weapon_two, unarmed, gadgets, throws }
                },
                season: {
                    rating: legendRanked.rating || 750,
                    peak_rating: legendRanked.peak_rating || 750,
                    tier: legendRanked.tier || 'Tin 0',
                    total_games: legendRanked.games || 0,
                    wins: legendRanked.wins || 0,
                    losses: legendRanked.games - legendRanked.wins || 0
                }

            }

            legends.push(legend);
        });
        resolve(legends);
    });
}

function getWeaponStats(name, damage_dealt, kills, time_held) {
    return { name, damage_dealt, kills, time_held: time_held };
}