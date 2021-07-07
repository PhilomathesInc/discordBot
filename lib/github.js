const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

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

const createOrUpdateFile = (owner, repo, filePath, repoPath, sha) => {
	const contentEncoded = getContent(filePath);
	const { data: fileBlobSHA } = octokit.rest.repos.createOrUpdateFileContents({
		owner,
		repo,
		path: repoPath,
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


const sync = (logger, owner, repo, branch, paths) => {
	const {dbPath, dbRepoPath, logPath, logRepoPath} = {...paths};
	setInterval(() => {
		githubSync(logger, owner, repo, branch, dbPath, dbRepoPath)
			.then(() => logSync(logger, owner, repo, branch, logPath, logRepoPath))
			.catch((error) => logger.error(error));
	}, 10000);
};

const githubSync = (logger, owner, repo, branch, filePath, repoPath) => {
	return new Promise(function(resolve, reject) {
		logger.info(`Updating file: ${repoPath} in ${owner}/${repo}/${branch}`);
		getLatestSHA(owner, repo, branch, repoPath)
			.then(sha => {
				// Update the file if we got the latest SHA
				createOrUpdateFile(owner, repo, filePath, repoPath, sha);
				resolve('Updated the file');
			},() => {
				// Create the file if previous SHA not found
				createOrUpdateFile(owner, repo, filePath, repoPath);
				resolve('Created the file');
			})
			.catch((error) => {
				logger.error(error);
				reject(`Failed to create/update the file: ${repoPath}`);
			});
	});
};

module.exports = {
	sync
};
