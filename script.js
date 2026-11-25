document.addEventListener('DOMContentLoaded', () => {
    const puzzleGate = document.getElementById('puzzleGate');
    const mainSite = document.getElementById('mainSite');
    const puzzlePiece = document.getElementById('puzzlePiece');
    const targetSlot = document.getElementById('targetSlot');
    const gateStatus = document.getElementById('gateStatus');
    const userCoinsEl = document.getElementById('userCoins');
    const toast = document.getElementById('toastNotification');
    const toastText = document.getElementById('toastText');

    let coins = 1250;
    let isUnlocked = false;

    function showToast(message) {
        toastText.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    function addCoins(amount) {
        coins += amount;
        userCoinsEl.textContent = coins;
    }

    function unlockWebsite() {
        if (isUnlocked) return;
        isUnlocked = true;
        targetSlot.innerHTML = '<i class="fa-solid fa-crown"></i>';
        targetSlot.classList.remove('hovered');
        targetSlot.classList.add('solved');
        puzzlePiece.classList.add('used');
        gateStatus.textContent = 'PUZZLE SOLVED! ENTERING ARENA...';

        setTimeout(() => {
            puzzleGate.classList.add('unlocked');
            mainSite.classList.add('visible');
            startCounters();
            initScrollReveal();
        }, 800);
    }

    puzzlePiece.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 'crown-piece');
    });

    targetSlot.addEventListener('dragover', (e) => {
        e.preventDefault();
        targetSlot.classList.add('hovered');
    });

    targetSlot.addEventListener('dragleave', () => {
        targetSlot.classList.remove('hovered');
    });

    targetSlot.addEventListener('drop', (e) => {
        e.preventDefault();
        unlockWebsite();
    });

    puzzlePiece.addEventListener('click', () => {
        unlockWebsite();
    });

    targetSlot.addEventListener('click', () => {
        unlockWebsite();
    });

    const themeBtn = document.getElementById('themeBtn');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeBtn.querySelector('i');
        if (document.body.classList.contains('light-theme')) {
            icon.className = 'fa-solid fa-moon';
        } else {
            icon.className = 'fa-solid fa-sun';
        }
    });

    function bindLoadingButton(button, doneText, rewardAmount, toastMsg) {
        button.addEventListener('click', () => {
            if (button.dataset.busy === 'true') return;
            button.dataset.busy = 'true';
            const originalHTML = button.innerHTML;
            button.textContent = 'Loading...';

            setTimeout(() => {
                button.innerHTML = doneText;
                if (rewardAmount > 0) {
                    addCoins(rewardAmount);
                }
                if (toastMsg) {
                    showToast(toastMsg);
                }
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.dataset.busy = 'false';
                }, 1500);
            }, 2000);
        });
    }

    const profileBtn = document.getElementById('profileBtn');
    bindLoadingButton(profileBtn, '<i class="fa-solid fa-check"></i><span>ONLINE</span>', 0, 'Player profile synced');

    const claimRewardBtn = document.getElementById('claimRewardBtn');
    bindLoadingButton(claimRewardBtn, 'CLAIMED +100', 100, '+100 Arcade Coins added to balance');

    document.querySelectorAll('.box90').forEach((btn) => {
        bindLoadingButton(btn, 'REGISTERED', 0, 'Tournament spot reserved');
    });

    document.querySelectorAll('.box73').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn.dataset.busy === 'true') return;
            btn.dataset.busy = 'true';
            const originalText = btn.textContent;
            btn.textContent = 'Loading...';

            setTimeout(() => {
                btn.textContent = 'LAUNCHED';
                showToast('Game engine loaded in Live Arena');
                document.getElementById('arena').scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.dataset.busy = 'false';
                }, 1500);
            }, 2000);
        });
    });

    document.querySelectorAll('.box128').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn.dataset.busy === 'true' || btn.dataset.owned === 'true') return;
            const cost = parseInt(btn.getAttribute('data-cost'), 10);
            if (coins < cost) {
                showToast('Not enough Arcade Coins');
                return;
            }
            btn.dataset.busy = 'true';
            btn.textContent = 'Loading...';

            setTimeout(() => {
                addCoins(-cost);
                btn.textContent = 'EQUIPPED';
                btn.dataset.owned = 'true';
                btn.dataset.busy = 'false';
                showToast('Booster unlocked and equipped');
            }, 2000);
        });
    });

    function startCounters() {
        const counters = document.querySelectorAll('.box31');
        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const step = Math.max(1, Math.ceil(target / 45));
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = current.toLocaleString();
                }
            }, 30);
        });
    }

    function initScrollReveal() {
        const leftElements = document.querySelectorAll('.box23, .box86, .box67:nth-child(odd), .box103:nth-child(odd), .box118:nth-child(odd), .box126:nth-child(odd)');
        const rightElements = document.querySelectorAll('.box32, .box91, .box67:nth-child(even), .box103:nth-child(even), .box118:nth-child(even), .box126:nth-child(even)');

        leftElements.forEach((el) => el.classList.add('reveal-left'));
        rightElements.forEach((el) => el.classList.add('reveal-right'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    }

    const tabButtons = document.querySelectorAll('.box42');
    const gamePanels = document.querySelectorAll('.box45');

    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            tabButtons.forEach((b) => b.classList.remove('box43'));
            gamePanels.forEach((p) => p.classList.remove('box46'));

            btn.classList.add('box43');
            const targetId = btn.getAttribute('data-game');
            document.getElementById(targetId).classList.add('box46');
        });
    });

    const startAimBtn = document.getElementById('startAimBtn');
    const aimBoard = document.getElementById('aimBoard');
    const aimTarget = document.getElementById('aimTarget');
    const aimMessage = document.getElementById('aimMessage');
    const aimScoreEl = document.getElementById('aimScore');
    const aimTimeEl = document.getElementById('aimTime');

    let aimScore = 0;
    let aimTime = 20;
    let aimInterval = null;

    function moveTarget() {
        const maxX = aimBoard.clientWidth - 60;
        const maxY = aimBoard.clientHeight - 60;
        const randX = Math.max(10, Math.floor(Math.random() * maxX));
        const randY = Math.max(10, Math.floor(Math.random() * maxY));
        aimTarget.style.left = randX + 'px';
        aimTarget.style.top = randY + 'px';
    }

    startAimBtn.addEventListener('click', () => {
        if (aimInterval) clearInterval(aimInterval);
        aimScore = 0;
        aimTime = 20;
        aimScoreEl.textContent = aimScore;
        aimTimeEl.textContent = aimTime;
        aimMessage.style.display = 'none';
        aimTarget.style.display = 'flex';
        moveTarget();

        aimInterval = setInterval(() => {
            aimTime--;
            aimTimeEl.textContent = aimTime;
            if (aimTime <= 0) {
                clearInterval(aimInterval);
                aimTarget.style.display = 'none';
                aimMessage.style.display = 'block';
                aimMessage.textContent = 'ROUND OVER! Final Score: ' + aimScore + ' (+' + (aimScore * 5) + ' Coins)';
                addCoins(aimScore * 5);
                showToast('Earned ' + (aimScore * 5) + ' coins in Cyber Target');
            }
        }, 1000);
    });

    aimTarget.addEventListener('click', () => {
        aimScore++;
        aimScoreEl.textContent = aimScore;
        moveTarget();
    });

    const memoryGrid = document.getElementById('memoryGrid');
    const memMovesEl = document.getElementById('memMoves');
    const memMatchesEl = document.getElementById('memMatches');
    const resetMemBtn = document.getElementById('resetMemBtn');

    const cardIcons = [
        'fa-rocket', 'fa-rocket',
        'fa-gem', 'fa-gem',
        'fa-shield-halved', 'fa-shield-halved',
        'fa-fire', 'fa-fire'
    ];

    let flippedCards = [];
    let memMoves = 0;
    let memMatches = 0;
    let lockBoard = false;

    function setupMemoryGame() {
        memoryGrid.innerHTML = '';
        flippedCards = [];
        memMoves = 0;
        memMatches = 0;
        lockBoard = false;
        memMovesEl.textContent = '0';
        memMatchesEl.textContent = '0';

        const shuffled = [...cardIcons].sort(() => Math.random() - 0.5);
        shuffled.forEach((iconClass) => {
            const card = document.createElement('div');
            card.className = 'mem-card';
            card.dataset.icon = iconClass;
            card.innerHTML = '<i class="fa-solid ' + iconClass + '"></i>';

            card.addEventListener('click', () => {
                if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;
                card.classList.add('flipped');
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    memMoves++;
                    memMovesEl.textContent = memMoves;
                    checkMemoryMatch();
                }
            });

            memoryGrid.appendChild(card);
        });
    }

    function checkMemoryMatch() {
        const [first, second] = flippedCards;
        if (first.dataset.icon === second.dataset.icon) {
            first.classList.add('matched');
            second.classList.add('matched');
            flippedCards = [];
            memMatches++;
            memMatchesEl.textContent = memMatches;
            if (memMatches === 4) {
                addCoins(75);
                showToast('Matrix Cleared! +75 Coins');
            }
        } else {
            lockBoard = true;
            setTimeout(() => {
                first.classList.remove('flipped');
                second.classList.remove('flipped');
                flippedCards = [];
                lockBoard = false;
            }, 700);
        }
    }

    resetMemBtn.addEventListener('click', setupMemoryGame);
    setupMemoryGame();

    const rpsButtons = document.querySelectorAll('.box60');
    const playerChoiceIcon = document.getElementById('playerChoiceIcon');
    const botChoiceIcon = document.getElementById('botChoiceIcon');
    const rpsResultText = document.getElementById('rpsResultText');
    const rpsPlayerScoreEl = document.getElementById('rpsPlayerScore');
    const rpsBotScoreEl = document.getElementById('rpsBotScore');

    let rpsPlayerScore = 0;
    let rpsBotScore = 0;

    const rpsIcons = {
        rock: 'fa-hand-back-fist',
        paper: 'fa-hand',
        scissors: 'fa-hand-scissors'
    };

    rpsButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const playerMove = btn.getAttribute('data-move');
            const moves = ['rock', 'paper', 'scissors'];
            const botMove = moves[Math.floor(Math.random() * moves.length)];

            playerChoiceIcon.innerHTML = '<i class="fa-solid ' + rpsIcons[playerMove] + '"></i>';
            botChoiceIcon.innerHTML = '<i class="fa-solid ' + rpsIcons[botMove] + '"></i>';

            if (playerMove === botMove) {
                rpsResultText.textContent = 'DRAW ROUND!';
            } else if (
                (playerMove === 'rock' && botMove === 'scissors') ||
                (playerMove === 'paper' && botMove === 'rock') ||
                (playerMove === 'scissors' && botMove === 'paper')
            ) {
                rpsPlayerScore++;
                rpsPlayerScoreEl.textContent = rpsPlayerScore;
                rpsResultText.textContent = 'YOU WIN! +15 COINS';
                addCoins(15);
            } else {
                rpsBotScore++;
                rpsBotScoreEl.textContent = rpsBotScore;
                rpsResultText.textContent = 'BOT WINS THIS ROUND';
            }
        });
    });

    const filterButtons = document.querySelectorAll('.box64');
    const gameCards = document.querySelectorAll('.box67');

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('box65'));
            btn.classList.add('box65');

            const filter = btn.getAttribute('data-filter');
            gameCards.forEach((card) => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    const proProfiles = {
        pubg: {
            badge: 'PUBG MOBILE PROFILE',
            name: 'ViperRecon',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            bio: 'Aggressive entry fragger and squad scout specializing in mid-range spray control and final circle rotations.',
            rank: 'Conqueror',
            role: 'Assault / Scout',
            stat: '5.42 K/D Ratio',
            achievement: 'Seasonal Top 100'
        },
        mlbb: {
            badge: 'MOBILE LEGENDS PROFILE',
            name: 'DawnBlade',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            bio: 'High-tempo jungler and roaming playmaker focused on early lord control, map vision, and decisive team fights.',
            rank: 'Mythic Glory',
            role: 'Jungler / Roamer',
            stat: '68% Win Rate',
            achievement: 'Supreme Title Holder'
        },
        val: {
            badge: 'VALORANT STRIKE PROFILE',
            name: 'PhantomZero',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
            bio: 'Disciplined duelist and anchor player known for crisp first-bullet accuracy and post-plant lineups.',
            rank: 'Immortal III',
            role: 'Duelist / Sentinel',
            stat: '31% Headshot Rate',
            achievement: 'Clutch Master'
        },
        drift: {
            badge: 'APEX DRIFT PROFILE',
            name: 'KuroApex',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
            bio: 'Precision circuit racer mastering late braking zones, turbo chain drifts, and clean time-trial sectors.',
            rank: 'S-Tier Legend',
            role: 'Circuit Specialist',
            stat: '142 Track Wins',
            achievement: 'Apex Cup Finalist'
        }
    };

    const profileGameBadge = document.getElementById('profileGameBadge');
    const profilePlayerName = document.getElementById('profilePlayerName');
    const profileAvatarImg = document.getElementById('profileAvatarImg');
    const profileBio = document.getElementById('profileBio');
    const profileRankVal = document.getElementById('profileRankVal');
    const profileRoleVal = document.getElementById('profileRoleVal');
    const profileStatVal = document.getElementById('profileStatVal');
    const profileBadgeVal = document.getElementById('profileBadgeVal');
    const proProfileCard = document.getElementById('proProfileCard');

    document.querySelectorAll('.box107').forEach((btn) => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-profile');
            const data = proProfiles[key];
            if (!data) return;

            profileGameBadge.textContent = data.badge;
            profilePlayerName.textContent = data.name;
            profileAvatarImg.src = data.avatar;
            profileBio.textContent = data.bio;
            profileRankVal.textContent = data.rank;
            profileRoleVal.textContent = data.role;
            profileStatVal.textContent = data.stat;
            profileBadgeVal.textContent = data.achievement;

            proProfileCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            showToast(data.name + ' profile loaded');
        });
    });

    document.querySelectorAll('.box133').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            item.classList.toggle('open');
        });
    });
});