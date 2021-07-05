const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

const owner = 'PhilomathesInc';
const repo = 'octokit-testing';
const branch = 'main';
const path = 'data.db';

function getContent(path) {
	return fs.readFileSync(path,'base64');
}

const getLatestSHA = async (owner, repo, branch, path) => {
	const { data: content } = await octokit.repos.getContent({
		owner: owner,
		repo: repo,
		path: path,
		ref: branch
	});
	return content.sha;
};

const createFileBlob = (owner, repo, path, sha) => {
	const contentEncoded = getContent(path);
	const { data: fileBlobSHA } = octokit.rest.repos.createOrUpdateFileContents({
		owner,
		repo,
		path,
		message: ':ok_hand: Update the database',
		content: contentEncoded,
		committer: {
			name: 'techfreak-bot',
			email: '34467411+techfreak-bot@users.noreply.github.com',
		},
		author: {
			name: 'techfreak-bot',
			email: '34467411+techfreak-bot@users.noreply.github.com',
		},
		sha,
	});
	return fileBlobSHA;
};

const main = () => {
	getLatestSHA(owner, repo, branch, path)
	// Update the file
		.then(sha => createFileBlob(owner, repo, path, sha))
	// Create the file
		.catch(() => createFileBlob(owner, repo, path));
};

main();
