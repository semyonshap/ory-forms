subm-ory:
	git submodule add https://github.com/ory/elements.git libs/ory

subm-ory-pull:
	cd libs/ory && git pull origin main

subm-ory-delete:
	git config -f .gitmodules --remove-section submodule.libs/ory
	git config --remove-section submodule.libs/ory
	git rm --cached libs/ory
	rm -rf .git/modules/libs/ory
	rm -rf libs/ory

subm-update:
	git submodule init
	git submodule update