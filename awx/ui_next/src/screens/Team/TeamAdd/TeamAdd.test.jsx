import React from 'react';
import { createMemoryHistory } from 'history';
import { mountWithContexts, waitForElement } from '@testUtils/enzymeHelpers';
import TeamAdd from './TeamAdd';
import { TeamsAPI } from '@api';

jest.mock('@api');

describe('<TeamAdd />', () => {
  test('handleSubmit should post to api', () => {
    const wrapper = mountWithContexts(<TeamAdd />);
    const updatedTeamData = {
      name: 'new name',
      description: 'new description',
    };
    wrapper.find('TeamForm').prop('handleSubmit')(updatedTeamData);
    expect(TeamsAPI.create).toHaveBeenCalledWith(updatedTeamData);
  });

  test('should navigate to teams list when cancel is clicked', () => {
    const history = createMemoryHistory({});
    const wrapper = mountWithContexts(<TeamAdd />, {
      context: { router: { history } },
    });
    wrapper.find('button[aria-label="Cancel"]').prop('onClick')();
    expect(history.location.pathname).toEqual('/teams');
  });

  test('should navigate to teams list when close (x) is clicked', () => {
    const history = createMemoryHistory({});
    const wrapper = mountWithContexts(<TeamAdd />, {
      context: { router: { history } },
    });
    wrapper.find('button[aria-label="Close"]').prop('onClick')();
    expect(history.location.pathname).toEqual('/teams');
  });

  test('successful form submission should trigger redirect', async () => {
    const history = createMemoryHistory({});
    const teamData = {
      name: 'new name',
      description: 'new description',
    };
    TeamsAPI.create.mockResolvedValueOnce({
      data: {
        id: 5,
        ...teamData,
      },
    });
    const wrapper = mountWithContexts(<TeamAdd />, {
      context: { router: { history } },
    });
    await waitForElement(wrapper, 'button[aria-label="Save"]');
    await wrapper.find('TeamForm').prop('handleSubmit')(teamData);
    expect(history.location.pathname).toEqual('/teams/5');
  });
});
