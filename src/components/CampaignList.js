import React from 'react';
import Campaign from './Campaign';
import {Inject} from './Context';
import {InjectCampaign} from './Context';

const CampaignList = ({campaigns, update, remove, toggle, redirect}) =>
    campaigns.length > 0 ?
        campaigns.map((campaign, index) =>
            <Campaign
                {...campaign}
                key={index}
                update={(k, v) => update(campaign.id, k, v)}
                remove={() => remove(campaign.id)}
                toggle={key => toggle(campaign.id, key)}
                toLeads={() => redirect('/leads/' + campaign.id)}
            />)
            :
            <h4 className='no-campaigns'>
                You have no campaigns yet.
            </h4>;



export default Inject(CampaignList, 'campaigns', 'toggle', 'remove', 'update', 'redirect');





