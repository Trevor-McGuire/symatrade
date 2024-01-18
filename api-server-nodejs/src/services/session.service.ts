import axios from 'axios';
import qs from 'qs'
import fetch from 'node-fetch'

type GitHubOauthToken = {
  access_token: string;
};

export const getGithubOathToken = async ({
  code,
}: {
  code: string;
}): Promise<any> => {
  const rootUrl = 'https://github.com/login/oauth/access_token';
  const options = {
    client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
    client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    code,
  };

  const queryString = qs.stringify(options);

  try {
    const { data } = await axios.post(`${rootUrl}?${queryString}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const decoded = qs.parse(data) as GitHubOauthToken;
    return decoded;
  } catch (err: any) {
    throw Error(err);
  }
};

export const getGithubUser = async ({
  access_token,
}: {
  access_token: string;
}): Promise<any> => {
  try {
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
    );
    const data = await response.json()
    if (!data.email) {
      const emailsResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${access_token}` },
      });
      const userEmails = emailsResponse.data;
      const primaryEmail = userEmails.find((email: any) => email.primary);
      const verifiedEmail = userEmails.find((email: any) => email.verified);
      const backupEmail = userEmails[0].email;
      data.email = primaryEmail.email || verifiedEmail.email || backupEmail.email;
    } else {
      throw new Error('email not found')
    }
    return data;
  } catch (err: any) {
    throw Error(err)
  }
};

type GoogleOauthToken = {
  access_token: string;
};

export const getGoogleOathToken = async ({
  code,
}: {
  code: string;
}): Promise<any> => {
  const rootUrl = 'https://oauth2.googleapis.com/token';
  const options = {
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    code,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: 'authorization_code',
  };
  console.log("options", options)

  const queryString = qs.stringify(options);
  console.log("queryString", queryString)
  try {
    const { data } = await axios.post(rootUrl, queryString, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log("data", data);
    const decoded = qs.parse(data) as GoogleOauthToken;
    console.log("decoded", decoded);
    return decoded;
  } catch (error: any) {
    console.error('Error message:', error.message);
    if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
    }
}
};

export const getGoogleUser = async ({
  access_token,
}: {
  access_token: string;
}): Promise<any> => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
    );
    const data = await response.json()
    return data;
  } catch (err: any) {
    throw Error(err)
  }
};